const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const auth = require("../middleware/auth");
const {upload} = require('../middleware/upload')
const { CreateBug, BugDetail , UpdateStatus , GetProjectBugs} = require("../controllers/bugController");


router.get("/projects/:projectId/bugs", verify, GetProjectBugs);
router.post("/projects/:projectId/bug", verify, auth("qa"), upload.single('img'), CreateBug);
router.get("/projects/:projectId/bug/:bugId", verify, BugDetail);
router.patch( "/projects/:projectId/bug/:bugId/status", verify, auth("developer"), UpdateStatus);

module.exports = router;
