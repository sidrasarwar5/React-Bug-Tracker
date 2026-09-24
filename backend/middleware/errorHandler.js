const isProduction = process.env.NODE_ENV === "production";

// Runs when no route matched
const notFound = (req, res) => {
  res.status(404).json({ error: "Route not found" });
};

// Central error handler (must have 4 arguments)
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // Invalid ObjectId, e.g. /bugs/abc
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // Duplicate key, e.g. email already registered
  if (err.code === 11000) {
    return res.status(409).json({ error: "Already exists" });
  }

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Body too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }

  const statusCode = err.statusCode || 500;
  console.error(err); // log the real error on the server only

  // Never leak internal messages on 500 errors in production
  const message =
    statusCode === 500 && isProduction
      ? "Something went wrong"
      : err.message || "Something went wrong";

  res.status(statusCode).json({ error: message });
};

module.exports = { notFound, errorHandler };