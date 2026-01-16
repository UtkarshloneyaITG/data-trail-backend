const Joi = require('joi');

const otpSchema = Joi.object({
  token: Joi.string().required(),
  otp: Joi.string().required(),
});
module.exports = otpSchema;
