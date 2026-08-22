const express = require('express');
const router = express.Router();
const verify = require('../middleware/verifyToken')
const auth = require('../middleware/auth')

router.get('/manager', verify , auth("manager") ,(req, res) => {
    
  res.send('Hello World!');
});


module.exports = router