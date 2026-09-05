const AuthManager = require("./AuthManager");
const asyncHandler = require("../../helpers/AsyncHandler");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, user_type, phone } = req.body;

  const data = await AuthManager.signup({
    name,
    email,
    password,
    user_type,
    phone,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await AuthManager.login({
    email,
    password,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, email, password } = req.body;

  const avatarUrl = req.file ? req.file.path : null;

  const data = await AuthManager.updateProfile({
    userId: req.userId,
    name,
    phone,
    email,
    password,
    avatarUrl,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  signup,
  login,
  updateProfile,
};