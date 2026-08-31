const AuthManager = require("./AuthManager");

async function signup(req, res) {
  try {
    const { name, email, password, user_type } = req.body;
    const data = await AuthManager.signup({ name, email, password, user_type });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await AuthManager.login({ email, password });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { signup, login };