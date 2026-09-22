const AuthManager = require("./AuthManager");
const asyncHandler = require("../../helpers/AsyncHandler");
const User = require("../../models/user");
const AppError = require("../../helpers/AppError"); 

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches current token expiry
};

const searchUsers = asyncHandler(async (req, res) => {
  const { search = "", user_type } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (user_type) {
    filter.user_type = user_type;
  }

  const users = await User.find(filter)
    .select("_id name email user_type avatarUrl")
    .limit(10);

  res.json(users);
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, user_type, phone } = req.body;

  const data = await AuthManager.signup({
    name,
    email,
    password,
    user_type,
    phone,
  });

  const { token, ...userData } = data;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    data: userData,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await AuthManager.login({
    email,
    password,
  });

  const { token, ...userData } = data;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    data: userData,
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

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select(
    "_id name email user_type phone avatarUrl",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      user_type: user.user_type,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    },
  });
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  searchUsers,
};
