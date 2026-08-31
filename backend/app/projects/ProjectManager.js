const { SendMail } = require("../../utils/mail");
const User = require("../../models/user");
const Project = require("../../models/project");

async function createProject({ name, userId }) {
  const newProject = new Project({
    name,
    creater: userId,
  });

  return newProject.save();
}

async function assignProject({ projectId, managerId, email, user_type }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("project not found");
  }

  if (project.creater.toString() !== managerId) {
    throw new Error("manger id failed to match");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No such qa or developer found");
  }

  if (user.user_type !== user_type) {
    throw new Error("The role has not matched to email.");
  }

  const isQa = user.user_type === "qa";
  const targetList = isQa ? project.assignedqas : project.assigneddeveloper;
  const alreadyAssigned = targetList.some((id) => id.toString() === user._id.toString());

  if (alreadyAssigned) {
    throw new Error("Already");
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
    throw new Error("Project not found");
  }

  if (project.creater.toString() !== userId) {
    throw new Error("Project not associated to this manger");
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