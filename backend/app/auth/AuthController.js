const AuthManager = require("./AuthManager");
const asyncHandler = require("../../helpers/AsyncHandler");

const fs = require("fs/promises");
const path = require("path");

const signup = asyncHandler(async (req, res) => {
  console.log("========== SIGNUP START ==========");

  const { name, email, password, user_type, phone } = req.body;

  console.log("Signup body:", {
    name,
    email,
    user_type,
    phone,
  });

  const data = await AuthManager.signup({
    name,
    email,
    password,
    user_type,
    phone,
  });

  console.log("Signup successful");

  res.status(200).json({
    success: true,
    data,
  });

  console.log("========== SIGNUP END ==========");
});

const login = asyncHandler(async (req, res) => {
  console.log("========== LOGIN START ==========");

  const { email, password } = req.body;

  console.log("Login email:", email);

  const data = await AuthManager.login({
    email,
    password,
  });

  console.log("Login successful");

  res.status(200).json({
    success: true,
    data,
  });

  console.log("========== LOGIN END ==========");
});

const updateProfile = asyncHandler(async (req, res) => {
  console.log("========== UPDATE PROFILE START ==========");

  console.log("User ID:", req.userId);
  console.log("Request body:", req.body);
  console.log("Received file:", req.file);

  const { name, phone, email, password } = req.body;

  let avatarUrl = null;

  console.log("Checking if avatar file exists...");

  if (req.file) {
    console.log("Avatar file received");
    console.log("Original name:", req.file.originalname);
    console.log("Mimetype:", req.file.mimetype);
    console.log("Size:", req.file.size);

    // Generate filename
    const fileName = `${Date.now()}-${req.file.originalname}`;

    console.log("Generated filename:", fileName);

    // Upload directory
    const uploadDir = path.join(__dirname, "../../uploads");

    console.log("Upload directory:", uploadDir);

    // Make sure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    console.log("Uploads directory ready");

    // Full file path
    const filePath = path.join(uploadDir, fileName);

    console.log("Full file path:", filePath);

    // Save image
    await fs.writeFile(filePath, req.file.buffer);

    console.log("Image file saved successfully");

    // URL for frontend
    avatarUrl = `/uploads/${fileName}`;

    console.log("Avatar URL:", avatarUrl);
  } else {
    console.log("No avatar file received");
  }

  console.log("Calling AuthManager.updateProfile...");

  const data = await AuthManager.updateProfile({
    userId: req.userId,
    name,
    phone,
    email,
    password,
    avatarUrl,
  });

  console.log("AuthManager.updateProfile completed");
  console.log("Updated user:", data);

  res.status(200).json({
    success: true,
    data,
  });

  console.log("========== UPDATE PROFILE END ==========");
});

module.exports = {
  signup,
  login,
  updateProfile,
};
