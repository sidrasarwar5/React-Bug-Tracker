const express = require("express");
const { uploadLogo } = require("../middleware/uploadLogo");
const { Authentication, Authorization } = require("../middleware");
const ProjectController = require("../app/projects/ProjectController");

const PROJECTS_ROUTES_PREFIX = "/projects";

const router = express.Router();

router.use(Authentication.authenticate);

router.post(
  PROJECTS_ROUTES_PREFIX,
  Authorization.auth("manager"),
   uploadLogo.single("logo"),
  ProjectController.createProject
);

router.get(PROJECTS_ROUTES_PREFIX, ProjectController.getProjects);

router.delete(
  `${PROJECTS_ROUTES_PREFIX}/:projectId`,
  Authorization.auth("manager"),
  ProjectController.deleteProject
);

router.patch(
  `${PROJECTS_ROUTES_PREFIX}/:projectId/assign`,
  Authorization.auth("manager"),
  ProjectController.assignProject
);

module.exports = router;