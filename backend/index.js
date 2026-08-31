const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
const mongoDb = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use(cors());
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
// middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
