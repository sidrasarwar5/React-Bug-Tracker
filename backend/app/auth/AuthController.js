const AuthManager = require("./AuthManager");
const asyncHandler = require("../../helpers/AsyncHandler");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, user_type } = req.body;
  const data = await AuthManager.signup({ name, email, password, user_type });

  res.status(200).json({ success: true, data });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await AuthManager.login({ email, password });

  res.status(200).json({ success: true, data });
});

module.exports = { signup, login };