const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, user_type } = req.body;

    //  console.log(req.body)

    const newUser = new User({
      name,
      email,
      password,
      user_type,
    });

    const saved = await newUser.save();
    let token;
    try {
      token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          user_type: newUser.user_type,
        },
        process.env.JWT_TOKEN,
        { expiresIn: "7d" },
      );
    } catch (err) {
      console.log(err);
      const error = new Error("something went wrong.");
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: {
        userId: newUser._id,
        email: newUser.email,
        user_type: newUser.user_type,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
