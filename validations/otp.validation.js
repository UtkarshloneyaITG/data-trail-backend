const otpSchema = require("./schema/otp.schema");

const otpValidation = async (body) => {
  const { error } = otpSchema.validate(body);
  if (error) {
    return {
      status: false,
      message: error.details[0].message,
    }
  } else {
    return { status: true }
  }
}
module.exports = otpValidation