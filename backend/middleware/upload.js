const multer = require("multer");

const upload = multer({
  dest: "uploads/",

  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/gif"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("png and gif are allowed"), false);
    }
  },
});

module.exports = { upload };
