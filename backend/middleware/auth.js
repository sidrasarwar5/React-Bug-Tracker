const jwt = require("jsonwebtoken");

function authorize(role) {
  return function (req, res, next) {
    if (req.user_type === role) {
      return next();
    } else {
      res.status(403).json({ error: "not matched" });
    }
  };
}

module.exports = authorize;
