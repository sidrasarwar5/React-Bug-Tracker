const verifyToken = require("./verifyToken");
const authorize = require("./auth");
const { upload } = require("./upload");
const {uploadLogo} = require("./uploadLogo")

const Authentication = {
  authenticate: verifyToken,
};

const Authorization = {
  auth: authorize,
};

const Upload = {
  single: upload.single.bind(upload),
};

const UploadLogo = {
  single: uploadLogo.single.bind(uploadLogo),
};

module.exports = { Authentication, Authorization, Upload, UploadLogo };