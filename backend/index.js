// Load env variables FIRST, before anything reads process.env
require("dotenv").config();

const app = require("./app");
const mongoDb = require("./config/db");

const port = process.env.PORT || 3000;

// Log forgotten catches instead of failing silently
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

// Exit so PM2 / the host restarts the app in a clean state
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Connect to the database first, then start listening
(async () => {
  try {
    await mongoDb();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
