const express = require("express");
const router = express.Router();
const User = require("../models/user");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const match = req.body.password === user.password;
      if (match) {
        let token;
        try {
          token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
              user_type: user.user_type,
            },
            process.env.JWT_TOKEN,
            { expiresIn: "7d" },
          );
        } catch {
          const error = new Error("Error! Something went wrong.");
          return next(error);
        }
        res.status(200).json({
          success: true,
          data: {
            userId: user._id,
            email: user.email,
            user_type: user.user_type,
            token: token,
          },
        });
      } else {
        res.status(400).json({ error: "wrong password" });
      }
    } else {
      res.status(400).json({ error: "dont exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
