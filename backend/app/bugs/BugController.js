const BugManager = require("./BugManager");
const asyncHandler = require("../../helpers/AsyncHandler");

const createBug = asyncHandler(async (req, res) => {
  const { title, desc, deadline, type, status, assignToDev } = req.body;
  const img = req.file ? req.file.filename : null;

  const saved = await BugManager.createBug({
    projectId: req.params.projectId,
    userId: req.userId,
    title,
    desc,
    deadline,
    type,
    status,
    assignToDev,
    img,
  });

  res.json(saved);
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const bug = await BugManager.updateStatus({
    projectId: req.params.projectId,
    bugId: req.params.bugId,
    userId: req.userId,
    status,
  });

  res.json(bug);
});

const bugDetail = asyncHandler(async (req, res) => {
  const data = await BugManager.bugDetail({
    projectId: req.params.projectId,
    bugId: req.params.bugId,
  });

  res.json(data);
});

const getProjectBugs = asyncHandler(async (req, res) => {
  const bugs = await BugManager.getProjectBugs({
    projectId: req.params.projectId,
    userId: req.userId,
  });

  res.json(bugs);
});

module.exports = { createBug, updateStatus, bugDetail, getProjectBugs };