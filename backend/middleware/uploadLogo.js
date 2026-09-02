const multer = require("multer");

const uploadLogo = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for project logos
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, and GIF files are allowed"), false);
    }
  },
});

module.exports = { uploadLogo };