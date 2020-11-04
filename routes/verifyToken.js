const jwt = require('jsonwebtoken');
//const user = require('../data/users.json');

module.exports = function (req, res, next) {
 const bearerHeader = req.header("authorization");
 if (!bearerHeader) return res.status(401).json({ "message": "token not provided" });
 try {
  if (typeof bearerHeader !== "undefined") {
   const bearer = bearerHeader.split(" ");
   const bearerToken = bearer[1];
   //req.token = bearerToken;
   const verified = jwt.verify(bearerToken, process.env.TOKEN_SECRET);
   console.log(verified);
   req.user = verified;
   next();
  }
 }
 catch (err) {
  res.status(400).send('Invalid Token');
 }
}