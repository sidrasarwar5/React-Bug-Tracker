const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const auth = require("../middleware/auth");
const Project = require("../models/project");
const { CreateProject, DeleteProject, AssignProject,GetProjects, } = require("../controllers/projectController");

router.post("/projects", verify, auth("manager"), CreateProject);
router.get('/projects' , verify  , GetProjects)
router.delete("/projects/:projectId", verify, auth("manager"), DeleteProject);
router.patch( "/projects/:projectId/assign", verify, auth("manager"), AssignProject);

module.exports = router;
