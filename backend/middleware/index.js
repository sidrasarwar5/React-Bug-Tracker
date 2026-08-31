const verifyToken = require("./verifyToken");
const authorize = require("./auth");
const { upload } = require("./upload");

const Authentication = {
  authenticate: verifyToken,
};

const Authorization = {
  auth: authorize,
};

const Upload = {
  single: upload.single.bind(upload),
};

module.exports = { Authentication, Authorization, Upload };