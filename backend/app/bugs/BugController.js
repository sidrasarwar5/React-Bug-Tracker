const BugManager = require("./BugManager");

async function createBug(req, res) {
  try {
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
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(400).json({ error: error.message || "Failed to create bug" });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;

    const bug = await BugManager.updateStatus({
      projectId: req.params.projectId,
      bugId: req.params.bugId,
      userId: req.userId,
      status,
    });

    res.json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function bugDetail(req, res) {
  try {
    const data = await BugManager.bugDetail({
      projectId: req.params.projectId,
      bugId: req.params.bugId,
    });

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getProjectBugs(req, res) {
  try {
    const bugs = await BugManager.getProjectBugs({
      projectId: req.params.projectId,
      userId: req.userId,
    });

    res.json(bugs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createBug, updateStatus, bugDetail, getProjectBugs };