const { SendMail } = require("../../utils/mail");
const User = require("../../models/user");
const Project = require("../../models/project");
const Bug = require("../../models/bug");

async function createBug({ projectId, userId, title, desc, deadline, type, status, assignToDev, img }) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("project not found");
  }

  const isAssignedQa = project.assignedqas.some((id) => id.toString() === userId);
  if (!isAssignedQa) {
    throw new Error("Qa is not assigned");
  }

  const devUser = await User.findOne({ email: assignToDev });
  if (!devUser) {
    throw new Error("Developer not add");
  }

  const devVerify = project.assigneddeveloper.some(
    (id) => id.toString() === devUser._id.toString()
  );
  if (!devVerify) {
    throw new Error("this developer not assigned to project");
  }

  const existingTitle = await Bug.findOne({ title, projectRef: projectId });
  if (existingTitle) {
    throw new Error("title exists");
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
    throw new Error("no such project found");
  }

  const bug = await Bug.findById(bugId);
  if (!bug) {
    throw new Error("no such bug available");
  }

  if (bug.projectRef.toString() !== projectId) {
    throw new Error("bug does not belong to this project");
  }

  if (bug.assignToDev.toString() !== userId) {
    throw new Error("no such developer is assigned to bug");
  }

  if (bug.type === "bug" && bug.status === "resolved") {
    throw new Error("This bug was already resolved.");
  }

  if (bug.type === "feature" && bug.status === "completed") {
    throw new Error("This feature was already completed.");
  }

  bug.status = status;
  await bug.save();

  return bug;
}

async function bugDetail({ projectId, bugId }) {
  const bug = await Bug.findById(bugId).populate("assignToDev", "name email");
  if (!bug) {
    throw new Error("Bug not found");
  }

  if (bug.projectRef.toString() !== projectId) {
    throw new Error("bug tot refer to this project");
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
    throw new Error("No such project found");
  }

  const isManager = project.creater.toString() === userId;
  const isQa = project.assignedqas.some((id) => id.toString() === userId);
  const isDeveloper = project.assigneddeveloper.some((id) => id.toString() === userId);

  if (!isManager && !isQa && !isDeveloper) {
    throw new Error("Not part of this project");
  }

  if (isDeveloper) {
    return Bug.find({ projectRef: projectId, assignToDev: userId });
  }

  return Bug.find({ projectRef: projectId });
}

module.exports = { createBug, updateStatus, bugDetail, getProjectBugs };