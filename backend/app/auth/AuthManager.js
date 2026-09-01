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
    email: user.email,
    user_type: user.user_type,
    token,
  };
}

module.exports = { signup, login };