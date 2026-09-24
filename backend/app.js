const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const {
  apiLimiter,
  loginLimiter,
  registerLimiter,
} = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");
const bugRouter = require("./routes/bug");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Needed behind Render/Vercel/Nginx so rate limiting sees the real client IP
app.set("trust proxy", 1);

// Security headers (relaxed CORP so your Vercel frontend can load /uploads images)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: isProduction
      ? "https://react-bug-tracker-virid.vercel.app"
      : "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(cookieParser());

// Rate limiting (adjust auth paths to match your real routes)
app.use(apiLimiter);
app.use("/login", loginLimiter);
app.use(["/register", "/signup"], registerLimiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/", authRouter);
app.use("/", projectRouter);
app.use("/", bugRouter);

// These two must stay last
app.use(notFound);
app.use(errorHandler);

module.exports = app;
