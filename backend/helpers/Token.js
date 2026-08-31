const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn });
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_TOKEN);
}

module.exports = { generateToken, verifyJwt };