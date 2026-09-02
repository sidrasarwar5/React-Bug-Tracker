const express = require("express");

const { Authentication, Authorization, Upload } = require("../middleware");
const BugController = require("../app/bugs/BugController");

const BUGS_ROUTES_PREFIX = "/projects/:projectId";
const BUG_ROUTES_PREFIX = `${BUGS_ROUTES_PREFIX}/bug`;

const router = express.Router();

router.use(Authentication.authenticate);

router.get(`${BUGS_ROUTES_PREFIX}/bugs`, BugController.getProjectBugs);

router.post(
  BUG_ROUTES_PREFIX,
  Authorization.auth("qa"),
  Upload.single("img"),
  BugController.createBug
);

router.get(`${BUG_ROUTES_PREFIX}/:bugId`, BugController.bugDetail);

router.patch(
  `${BUG_ROUTES_PREFIX}/:bugId/status`,
  Authorization.auth("developer"),
  BugController.updateStatus
);

router.delete(
  `${BUG_ROUTES_PREFIX}/:bugId`,
  BugController.deleteBug
);

module.exports = router;