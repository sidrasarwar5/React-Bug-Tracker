const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
const mongoDb = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: "https://react-bug-tracker-virid.vercel.app",
}));


// app.use(cors({ origin: "http://localhost:5173", credentials: true, }));



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");
const bugRouter = require("./routes/bug");

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoDb();
app.use("/", authRouter);
app.use("/", projectRouter);
app.use("/", bugRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || "Something went wrong" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});