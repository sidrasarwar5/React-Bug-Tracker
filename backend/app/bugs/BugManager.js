const { SendMail } = require("../../utils/mail");
const User = require("../../models/user");
const Project = require("../../models/project");
const Bug = require("../../models/bug");
const AppError = require("../../helpers/AppError");

async function createBug({ projectId, userId, title, desc, deadline, type, status, assignToDev, img }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("project not found", 404);
  }

  const isAssignedQa = project.assignedqas.some((id) => id.toString() === userId);
  if (!isAssignedQa) {
    throw new AppError("Qa is not assigned", 403);
  }

  const devUser = await User.findOne({ email: assignToDev });
  if (!devUser) {
    throw new AppError("Developer not add", 404);
  }

  const devVerify = project.assigneddeveloper.some(
    (id) => id.toString() === devUser._id.toString()
  );
  if (!devVerify) {
    throw new AppError("this developer not assigned to project", 403);
  }

  const existingTitle = await Bug.findOne({ title, projectRef: projectId });
  if (existingTitle) {
    throw new AppError("title exists", 409);
  }

  const qaInfo = await User.findById(userId);

  const newBug = new Bug({
    title,
    desc,
    deadline,
    img,
    type,
    status,
    reporter: userId,
    projectRef: project._id,
    assignToDev: devUser._id,
  });

  const saved = await newBug.save();
  SendMail(devUser.email, qaInfo.name, project.name);

  return saved;
}

async function updateStatus({ projectId, bugId, userId, status }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("no such project found", 404);
  }

  const bug = await Bug.findById(bugId);
  if (!bug) {
    throw new AppError("no such bug available", 404);
  }

  if (bug.projectRef.toString() !== projectId) {
    throw new AppError("bug does not belong to this project", 403);
  }

  if (bug.assignToDev.toString() !== userId) {
    throw new AppError("no such developer is assigned to bug", 403);
  }

  if (bug.type === "bug" && bug.status === "resolved") {
    throw new AppError("This bug was already resolved.", 403);
  }

  if (bug.type === "feature" && bug.status === "completed") {
    throw new AppError("This feature was already completed.", 403);
  }

  bug.status = status;
  await bug.save();

  return bug;
}

async function bugDetail({ projectId, bugId }) {
  const bug = await Bug.findById(bugId).populate("assignToDev", "name email");
  if (!bug) {
    throw new AppError("Bug not found", 404);
  }

  if (bug.projectRef.toString() !== projectId) {
    throw new AppError("bug tot refer to this project", 403);
  }

  return {
    ...bug.toObject(),
    time_passed: bug.time_passed(),
    stale: bug.stale(),
  };
}

async function getProjectBugs({ projectId, userId }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("No such project found", 404);
  }

  const isManager = project.creater.toString() === userId;
  const isQa = project.assignedqas.some((id) => id.toString() === userId);
  const isDeveloper = project.assigneddeveloper.some((id) => id.toString() === userId);

  if (!isManager && !isQa && !isDeveloper) {
    throw new AppError("Not part of this project", 403);
  }

  if (isDeveloper) {
    return Bug.find({ projectRef: projectId, assignToDev: userId });
  }

  return Bug.find({ projectRef: projectId });
}

module.exports = { createBug, updateStatus, bugDetail, getProjectBugs };