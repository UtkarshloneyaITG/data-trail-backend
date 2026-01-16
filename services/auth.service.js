const sequelize = require("../config/db");
const httpMessage = require("../constants/httpMessage");
const User = require("../models/auth.modal");
const OTP = require("../models/verification_otps.modal");
const { message } = require("../validations/schema/signup.schema");

const signUpService = async (req) => {
  try {
    const { username, email, password } = req

    const data = await sequelize.transaction(async (t) => {
      // Create user
      const user = await User.create({ username, email, password }, { transaction: t });
      const otpValue = (Math.floor(100000 + Math.random() * 900000)).toString();
      // Create OTP for the user
      console.log("otp", otpValue)

      await OTP.create(
        {
          userId: user.id,
          otp: otpValue,
          expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
        { transaction: t }
      );

      return user
    });
    return {
      status: true,
      message: "",
      result: data.id
    }
  } catch (error) {
    throw error
  }
}
const verifyUserService = async (req) => {
  try {
    const { token, otp } = req
    const verify = await OTP.findOne({ where: { userId: token } })
    const user = await User.findByPk(token)
    if (!user) {
      await OTP.destroy({ where: { userId: token } })
      return {
        status: false,
        message: httpMessage.AUTH.UNAUTHORIZED,
        result: {
          retry: false,
          authorize: false
        }
      }
    }

    if (verify) {
      const now = new Date();
      // Check if expired
      if (now > verify.expireAt) {
        await User.destroy({ where: { id: token } })
        return {
          status: false,
          message: httpMessage.AUTH.TOKEN_EXPIRED,
          result: {
            retry: false,
            authorize: false
          }
        }; // OTP has expired
      }
      const isValid = await verify.validateOtp(otp);
      if (isValid) {
        await OTP.destroy({ where: { id: verify.id } })
        user.verifiedAt = new Date()
        await user.save()
        return {
          status: true,
          message: httpMessage.SUCCESS.OK,
          result: { retry: false, authorize: true }
        }
      }
      const attepmt = verify.attempts
      if (attepmt > 4) {
        await User.destroy({ where: { id: token } })
        return {
          status: false,
          message: httpMessage.AUTH.UNAUTHORIZED,
          result: {
            retry: false,
            authorize: false
          }
        }
      }
      else {
        verify.attempts = attepmt + 1
        await verify.save()
        return {
          status: false,
          message: httpMessage.AUTH.TOKEN_INVALID,
          result: {
            retry: true,
            authorize: false
          }
        }
      }
    }
    else {
      if (user.verifiedAt) {
        return {
          status: false,
          message: "already verified",
          result: {
            retry: false,
            authorize: true
          }
        }
      }
      else {
        return {
          status: false,
          message: httpMessage.NOT_FOUND.USER,
          result: {
            retry: false,
            authorize: false
          }
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const loginService = async (req) => {
  try {
    const { email, password } = req
    const data = await User.findOne({ where: { email: email } })
    const valid = data.validatePassword(password)
    if (!valid) {
      return {
        status: false,
        message: httpMessage.AUTH.INVALID_CREDENTIALS,
      }
    }
    return {
      status: true,
      message: httpMessage.SUCCESS.OK
    }
  } catch (error) {
    throw error
  }
}
module.exports = { signUpService, verifyUserService, loginService }