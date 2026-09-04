const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { generateToken } = require("../../helpers/Token");
const AppError = require("../../helpers/AppError");

async function signup({ name, email, password, user_type, phone }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    user_type,
  });

  const saved = await newUser.save();

  const token = generateToken({
    userId: saved._id,
    email: saved.email,
    user_type: saved.user_type,
  });

  return {
    userId: saved._id,
    name: saved.name,
    phone: saved.phone,
    email: saved.email,
    user_type: saved.user_type,
    token,
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Don't exist", 404);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError("Wrong password", 401);
  }

  const token = generateToken({
    userId: user._id,
    email: user.email,
    user_type: user.user_type,
  });

  return {
    userId: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    user_type: user.user_type,
    token,
  };
}

async function updateProfile({ userId, name, phone, email, password, avatarUrl }) {
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (email) updates.email = email;
  if (avatarUrl) updates.avatarUrl = avatarUrl;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!updated) {
    throw new AppError("User not found", 404);
  }

  return {
    userId: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    user_type: updated.user_type,
    avatarUrl: updated.avatarUrl,
  };
}

module.exports = { signup, login, updateProfile };