const Joi = require('joi');

const signUpSchema = Joi.object({
  userName:Joi
  .string()
  .min(3).required(),
  email: Joi
    .string()
    .min(8)
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password :Joi.string()
    .alphanum()
    .min(3).required(),
    img:Joi.string()  
  
});

const signInSchema = Joi.object({
  
  email: Joi
    .string()
    .min(8)
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password :Joi.string()
    .alphanum()
    .min(3).required(),
});

module.exports = {signInSchema,signUpSchema};