const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');


router.get('/', async (req, res) => {
 await fs.readFile('./data/users.json', (err, data) => {
  if (err) { throw new Error('Something wrong when reading file'); }
  else {
   let users = JSON.parse(data);
   res.status(200).json({ users })
  }

 });
})


router.post('/',
 [check('name').isLength({ min: 6 }).withMessage('UserName Must be at least 6 chars long'), check('password').isLength({ min: 8 }).withMessage('Password Must be at least 8 chars long'),
 check('email').isEmail().withMessage('Must be a valid email address!'),],
 async (req, res) => {
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

  const { name, email, password } = req.body;
  let userRegister = {
   id: uuidv4(),
   name: name,
   email: email,
   password: password
  };

  fs.readFile('./data/users.json', 'utf8', await function (err, data) {
   if (err) {
    throw new Error("cannot read user file correctly.")
   } else {
    obj = JSON.parse(data);
    const check = obj.find(item => item.email === req.body.email);
    if (!check) {
     obj.push(userRegister);
     let json = JSON.stringify(obj);

     fs.writeFile('./data/users.json', json, 'utf-8', function (err, data) {
      if (err) return res.status(400).json({ err });
      res.status(200).json({ data })
     })
    } else {
     return res.status(400).json("This email has already registered!");
    }
   }
  })
 });


module.exports = router;

