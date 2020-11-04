const router = require('express').Router();
const verify = require("./verifyToken");
const jwt = require('jsonwebtoken');
let Users = require('../data/users.json');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

router.get('/', verify, (req, res) => {
 jwt.verify(req.token, process.env.TOKEN_SECRET, (err, data) => {
  if (err) {
   res.sendStatus(403)
  } else {
   res.json({ data })
  }

 });

})


router.post('/', [check('password').isLength({ min: 8 }).withMessage('Password Must be at least 8 chars long'),
check('email').isEmail().withMessage('Must be a valid email address!'),], async (req, res) => {
 // auth user
 const error = validationResult(req);
 if (!error.isEmpty()) {
  return res.status(422).json({ error })
 }

 let data = await fs.readFile('./data/users.json', (err, data) => {
  if (err) throw err;
  let user = JSON.parse(data);
  console.log(user)

  if (user.email !== req.body.email || user.password != req.body.password) {
   return res.status(400).json({ "message": "incorrect credentials provided" })
  }
  else {
   const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
   res.json({
    token: token
   })

  }
 });


})

module.exports = router;