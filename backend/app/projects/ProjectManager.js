const { SendMail } = require("../../utils/mail");
const User = require("../../models/user");
const Project = require("../../models/project");
const AppError = require("../../helpers/AppError");

async function createProject({ name, userId ,  description }) {
  const newProject = new Project({
    name,
     description,
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
  const alreadyAssigned = targetList.some((id) => id.toString() === user._id.toString());

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
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.creater.toString() !== userId) {
    throw new AppError("Project not associated to this manger", 403);
  }

  return Project.deleteOne({ _id: projectId });
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

  return Project.find(filter)
    .populate("assignedqas", "email name")
    .populate("assigneddeveloper", "email name")
    .populate("creater", "name");
}

module.exports = { createProject, assignProject, deleteProject, getProjects };