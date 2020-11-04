const Joi = require('joi');

const loginValidation = (data) => {
 const schema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email()
 });
 return schema.validate(data);
}

module.exports.loginValidation = loginValidation;