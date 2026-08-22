const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv')
const mongoDb = require('./config/db')
const cors = require('cors');
const path = require("path");




dotenv.config()
app.use(express.json())
 app.use(cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
const signUpRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const qaRouter = require('./routes/qa')
const managerRouter = require('./routes/manager')
const developerRouter = require('./routes/developer')
const createProjectRouter = require('./routes/project')
const assignToRouter = require('./routes/project')
const assignDevRouter = require('./routes/bug')
const statusUpdateRouter = require('./routes/bug')
const bugInfoRoute = require('./routes/bug')
app.use(express.urlencoded({extended : false}))
app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoDb()
app.use('/' , signUpRouter)
app.use('/' , loginRouter)
app.use('/' , qaRouter)
app.use('/' , managerRouter)
app.use('/' , developerRouter)
app.use('/' , createProjectRouter)
app.use('/' , assignToRouter)
app.use('/', assignDevRouter)
app.use('/', statusUpdateRouter)
app.use('/' , bugInfoRoute)
// middleware


app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});