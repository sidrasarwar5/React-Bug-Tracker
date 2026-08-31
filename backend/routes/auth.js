const express = require("express");

const AuthController = require("../app/auth/AuthController");

const AUTH_ROUTES_PREFIX = "/auth";

const router = express.Router();

router.post(`${AUTH_ROUTES_PREFIX}/signup`, AuthController.signup);
router.post(`${AUTH_ROUTES_PREFIX}/login`, AuthController.login);

module.exports = router;