const ProjectManager = require("./ProjectManager");

async function createProject(req, res) {
  try {
    const { name } = req.body;
    const saved = await ProjectManager.createProject({ name, userId: req.userId });
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function assignProject(req, res) {
  try {
    const { email, user_type } = req.body;
    const project = await ProjectManager.assignProject({
      projectId: req.params.projectId,
      managerId: req.userId,
      email,
      user_type,
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const del = await ProjectManager.deleteProject({
      projectId: req.params.projectId,
      userId: req.userId,
    });
    res.json(del);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await ProjectManager.getProjects({
      userId: req.userId,
      userType: req.user_type,
    });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createProject, assignProject, deleteProject, getProjects };