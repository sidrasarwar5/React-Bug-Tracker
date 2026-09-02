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

  // assignToDev now arrives as an array of emails
  const devEmails = Array.isArray(assignToDev) ? assignToDev : [assignToDev];

  const devUsers = await User.find({ email: { $in: devEmails } });
  if (devUsers.length !== devEmails.length) {
    throw new AppError("One or more developers not found", 404);
  }

  const assignedDevIds = project.assigneddeveloper.map((id) => id.toString());
  const allVerified = devUsers.every((dev) => assignedDevIds.includes(dev._id.toString()));
  if (!allVerified) {
    throw new AppError("One or more developers not assigned to this project", 403);
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
    assignToDev: devUsers.map((dev) => dev._id),
  });

  const saved = await newBug.save();

  devUsers.forEach((dev) => SendMail(dev.email, qaInfo.name, project.name));

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

  const isAssignedDev = bug.assignToDev.some((id) => id.toString() === userId);
  if (!isAssignedDev) {
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

  const query = isDeveloper
    ? { projectRef: projectId, assignToDev: userId }
    : { projectRef: projectId };

  return Bug.find(query)
    .populate("assignToDev", "name email")
    .populate("reporter", "name email")
    .sort({ createdAt: -1 });
}

async function deleteBug({ projectId, bugId, userId }) {
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

  const isManager = project.creater.toString() === userId;
  const isReporter = bug.reporter.toString() === userId;

  if (!isManager && !isReporter) {
    throw new AppError("Not authorized to delete this bug", 403);
  }

  await bug.deleteOne();
  return { message: "Bug deleted successfully" };
}

module.exports = { createBug, updateStatus, bugDetail, getProjectBugs, deleteBug };

