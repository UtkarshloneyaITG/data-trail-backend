const loginSchema = require("./schema/login.schema");

const loginVaidation = async (body) => {
  const { error } = loginSchema.validate(body);
  if (error) {
    return {
      status: false,
      message: error.details[0].message,
    }
  } else {
    return { status: true }
  }
}
module.exports = loginVaidation