const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: path.join(__dirname, "../uploads/"),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/gif", "image/jpeg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("png, gif, and jpeg are allowed"), false);
    }
  },
});

module.exports = { upload };