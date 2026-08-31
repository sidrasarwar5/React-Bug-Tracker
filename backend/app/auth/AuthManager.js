const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { generateToken } = require("../../helpers/Token");

async function signup({ name, email, password, user_type }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
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
    email: saved.email,
    user_type: saved.user_type,
    token,
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("dont exist");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("wrong password");
  }

  const token = generateToken({
    userId: user._id,
    email: user.email,
    user_type: user.user_type,
  });

  return {
    userId: user._id,
    email: user.email,
    user_type: user.user_type,
    token,
  };
}

module.exports = { signup, login };