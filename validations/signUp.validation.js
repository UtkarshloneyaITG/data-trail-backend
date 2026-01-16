const signupSchema = require("./schema/signup.schema");

const signUpVaidation = async (body) => {
  const { error } = signupSchema.validate(body);
  if (error) {
    return {
      status: false,
      message: error.details[0].message,
    }
  } else {
    return { status: true }
  }
}
module.exports = signUpVaidation