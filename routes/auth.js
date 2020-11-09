const router = require('express').Router();
const verify = require("./verifyToken");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
router.get('/', verify, (req, res) => {
 jwt.verify(req.token, process.env.TOKEN_SECRET, (err, data) => {
  if (err) {
   res.sendStatus(403).json({ err })
  } else {
   res.status(200).json({ data })
  }
 });
})

const maxAge = 3 * 24 * 60 * 60;
router.post('/', [check('password').isLength({ min: 8 }).withMessage('Password Must be at least 8 chars long'),
check('email').isEmail().withMessage('Must be a valid email address!'),], async (req, res) => {
 // auth user
 const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
   return {
    message: "validation error",
    invalid: error.msg,
   };
  }
 });
 const errors = myValidationResult(req);

 if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
 }

 const { email, password } = req.body;
 await fs.readFile('./data/users.json', 'utf8', (err, data) => {
  if (err) throw new Error('Something wrong when reading file');
  let users = JSON.parse(data);
  const userAuth = users.find(item => item.email === email)
  if (!userAuth) return res.status(400).json("Email is not found!");
  const validPass = users.find(item => item.password === password)
  if (!validPass) return res.status(400).json("Password is invalid!");
  // if input correct username and password then run following code
  const token = jwt.sign({ _id: users._id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
  res.status(201).json({ token });

  // return res.status(400).json({ "message": "incorrect credentials provided" })

 })
});



module.exports = router;

