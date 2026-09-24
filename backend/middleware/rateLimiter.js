const rateLimit = require("express-rate-limit");

// General limit for the whole API (per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  // Don't count health checks or static image requests
  skip: (req) => req.path === "/health" || req.path.startsWith("/uploads"),
  message: { error: "Too many requests, please try again later." },
});

// Login: only FAILED attempts count, so normal users are never blocked
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});

// Register: every request counts, so bots can't mass-create accounts
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many signups from this network, please try again later.",
  },
});

module.exports = { apiLimiter, loginLimiter, registerLimiter };
