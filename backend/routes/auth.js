const express = require("express");

const { Authentication, UploadLogo } = require("../middleware");
const AuthController = require("../app/auth/AuthController");

const AUTH_ROUTES_PREFIX = "/auth";

const router = express.Router();

router.post(`${AUTH_ROUTES_PREFIX}/signup`, AuthController.signup);
router.post(`${AUTH_ROUTES_PREFIX}/login`, AuthController.login);

router.patch(
  `${AUTH_ROUTES_PREFIX}/profile`,
  Authentication.authenticate,
   UploadLogo.single("avatar"), 
  AuthController.updateProfile,
);

module.exports = router;
