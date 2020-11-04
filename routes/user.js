const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
 const userData = await fs.readFile('./data/users.json', (err, data) => {
  if (err) throw err;
  let users = JSON.parse(data);
  res.status(200).json({ users })
 });
})


router.post('/',
 [check('name').isLength({ min: 6 }).withMessage('UserName Must be at least 6 chars long'), check('password').isLength({ min: 8 }).withMessage('Password Must be at least 8 chars long'),
 check('email').isEmail().withMessage('Must be a valid email address!'),],
 (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(422).json({ errors: errors.array() })
  }
  let userArr = {};
  usersArr = fs.readFileSync('./data/users.json', (err, d) => {
   if (err) throw err;
   return { ...JSON.parse(d) };
  })
  const { name, email, password } = req.body;

  let user = {
   id: uuidv4(),
   name: name,
   email: email,
   password: password
  };


  var data = JSON.stringify(user, null, 2);
  fs.appendFile('./data/users.json', data, 'utf8', (err) => {
   if (err) throw err;
   console.log('Data written to file');
  });

  let appendData = res.status(200).json({ data });
  usersArr.push(appendData);

  console.log("JSON file has been saved.");
 });

module.exports = router;