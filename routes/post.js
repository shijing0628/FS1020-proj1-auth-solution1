const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const verify = require("./verifyToken");

router.get('/entries', verify, async (req, res) => {
 const entriesData = await fs.readFile('./data/entries.json', (err, data) => {
  if (err) throw err;
  let entryData = JSON.parse(data);
  res.status(200).json({ entryData })
 });
})

router.get('/entries/:id', verify, async (req, res) => {
 const entriesData = await fs.readFile('./data/entries.json', (err, data) => {
  if (err) throw err;
  let entryDataArr = JSON.parse(data);
  let oneData = entryDataArr.find(item => item.id === req.params.id)
  if (!oneData) return res.status(401).json({ "message": "entry 23bacf-3b7d-4bad-9bdd-2b0d7b3dcb6d not found" })
  res.status(200).json({ oneData })
 });
})



router.post('/entries',
 [check('name').isLength({ min: 6 }).withMessage('Must be at least 10 chars long'),
 check('email').isEmail().withMessage('must be a valid email address!'), check('phoneNumber').isMobilePhone().withMessage('Phone input must be a number!')],
 (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(422).json({ errors: errors.array() })
  }
  const { name, email, phoneNumber, content } = req.body;
  const entryData = {}
  let entryUser = {
   id: uuidv4(),
   name: name,
   email: email,
   phoneNumber: phoneNumber,
   content: content
  };

  let data = JSON.stringify(entryUser);
  entryData = fs.writeFileSync('./data/entries.json', data);
  res.status(200).json({ entryData })
 })


module.exports = router;