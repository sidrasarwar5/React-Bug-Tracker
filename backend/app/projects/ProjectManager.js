const mongoose = require("mongoose");
const { SendMail } = require("../../utils/mail");
const { deleteImages } = require("../../utils/cloudinaryDelete");
const User = require("../../models/user");
const Bug = require("../../models/bug");
const Project = require("../../models/project");
const AppError = require("../../helpers/AppError");

async function createProject({ name, userId, description, logo }) {
  const existing = await Project.findOne({ name, creater: userId });
  if (existing) {
    throw new AppError("You already have a project with this name", 409);
  }

  const newProject = new Project({
    name,
    description,
    logo,
    creater: userId,
  });

  return newProject.save();
}

async function assignProject({ projectId, managerId, email, user_type }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("project not found", 404);
  }

  if (project.creater.toString() !== managerId) {
    throw new AppError("manger id failed to match", 403);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No such qa or developer found", 404);
  }

  if (user.user_type !== user_type) {
    throw new AppError("The role has not matched to email.", 403);
  }

  const isQa = user.user_type === "qa";
  const targetList = isQa ? project.assignedqas : project.assigneddeveloper;
  const alreadyAssigned = targetList.some(
    (id) => id.toString() === user._id.toString(),
  );

  if (alreadyAssigned) {
    throw new AppError("Already", 409);
  }

  if (isQa) {
    project.assignedqas.push(user._id);
  } else {
    project.assigneddeveloper.push(user._id);
  }

  await project.save();

  const manager = await User.findById(managerId);
  SendMail(user.email, manager.name, project.name);

  return project;
}

async function deleteProject({ projectId, userId }) {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.creater.toString() !== userId) {
    throw new AppError("Project not associated to this manger", 403);
  }

  // Collect image links BEFORE the records are deleted
  const bugs = await Bug.find({ projectRef: projectId }).select("img").lean();
  const imageUrls = [project.logo, ...bugs.map((bug) => bug.img)];

  // Children first, parent last: if anything fails in between, the
  // project still exists and the manager can simply click Delete again.
  const { deletedCount } = await Bug.deleteMany({ projectRef: projectId });
  await Project.deleteOne({ _id: projectId });

  // Best effort cleanup; never throws
  await deleteImages(imageUrls);

  return { message: "Project and its bugs deleted", deletedBugs: deletedCount };
}

async function getProjects({ userId, userType }) {
  const filterMap = {
    qa: { assignedqas: userId },
    developer: { assigneddeveloper: userId },
    manager: { creater: userId },
  };

  const filter = filterMap[userType];
  if (!filter) {
    return [];
  }

  const projects = await Project.find(filter)
    .populate("assignedqas", "email name avatarUrl")
    .populate("assigneddeveloper", "email name avatarUrl")
    .populate("creater", "name");

  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const total = await Bug.countDocuments({ projectRef: project._id });
      const done = await Bug.countDocuments({
        projectRef: project._id,
        status: { $in: ["resolved", "completed"] },
      });

      return {
        ...project.toObject(),
        taskProgress: { done, total },
      };
    }),
  );

  return projectsWithProgress;
}

module.exports = { createProject, assignProject, deleteProject, getProjects };
