const ProjectManager = require("./ProjectManager");
const asyncHandler = require("../../helpers/AsyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const logo = req.file ? req.file.path : null;

  const saved = await ProjectManager.createProject({
    name,
    description,
    logo,
    userId: req.userId,
  });

  res.json(saved);
});

const assignProject = asyncHandler(async (req, res) => {
  const { email, user_type } = req.body;
  const project = await ProjectManager.assignProject({
    projectId: req.params.projectId,
    managerId: req.userId,
    email,
    user_type,
  });
  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const del = await ProjectManager.deleteProject({
    projectId: req.params.projectId,
    userId: req.userId,
  });
  res.json(del);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectManager.getProjects({
    userId: req.userId,
    userType: req.user_type,
  });
  res.json(projects);
});

module.exports = { createProject, assignProject, deleteProject, getProjects };