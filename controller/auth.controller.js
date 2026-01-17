
const signUpVaidation = require("../validations/signUp.validation")
const statusCode = require("../constants/httpStatus")
const httpMessage = require("../constants/httpMessage")
const authService = require("../services/auth.service")
const User = require("../models/auth.modal")
const { message } = require("../validations/schema/signup.schema")
const OTP = require("../models/verification_otps.modal")
const otpValidation = require("../validations/otp.validation")
const loginVaidation = require("../validations/login.validation")


const signUp = async (req, res) => {
  try {
    const validate = await signUpVaidation(req.body)
    if (!validate.status) {
      console.log("authentication failed", validate.message)
      return res.status(statusCode.BAD_REQUEST).json({ statusCode: statusCode.BAD_REQUEST, status: false, message: validate.message })
    }
    const isUserExist = await User.findOne({ where: { email: req.body.email } })

    if (isUserExist) {
      if (!isUserExist.verifiedAt) {
        await User.destroy({ where: { id: isUserExist.id } })
      }
      else {
        return res.status(statusCode.BAD_REQUEST).json({ status: false, message: httpMessage.VALIDATION.EMAIL_EXISTS })
      }
    }
    const data = await authService.signUpService(req.body)
    return res.status(statusCode.CREATED).json({
      message: "OTP send to your mail",
      status: true,
      result: { token: data.result }
    })
  } catch (error) {
    console.log("error in signup user controller", error)
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpMessage.SERVER.INTERNAL_ERROR })
  }
}
const verifyuser = async (req, res) => {
  try {
    const validate = await otpValidation(req.body)
    if (!validate.status) {
      console.log("authentication failed", validate.message)
      return res.status(statusCode.BAD_REQUEST).json({ statusCode: statusCode.BAD_REQUEST, status: false, message: validate.message })
    }
    const data = await authService.verifyUserService(req.body)
    if (!data?.status) {
      return res.status(statusCode.BAD_REQUEST).json(data)
    } else {
      res.status(statusCode.OK).json(data)
    }
  } catch (error) {
    console.log("error in verify user controller", error)
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpMessage.SERVER.INTERNAL_ERROR })
  }
}
const loginUser = async (req, res) => {
  try {
    const validate = await loginVaidation(req.body)
    console.log(req.body,"sdfasdfasdfasdfasdf")
    if (!validate.status) {
      console.log("authentication failed", validate.message)
      return res.status(statusCode.BAD_REQUEST).json({ statusCode: statusCode.BAD_REQUEST, status: false, message: validate.message })
    }
    const userIsVerified = await User.findOne({ where: { email: req.body.email } })

    if (!userIsVerified.verifiedAt) {
      return res.status(statusCode.UNAUTHORIZED).json({ status: false, message: httpMessage.AUTH.UNAUTHORIZED })
    }
    const data = await authService.loginService(req.body, res)
    if (!data?.status) {
      return res.status(statusCode.BAD_REQUEST).json(data)
    } else {
      res.status(statusCode.OK).json(data)
    }
  } catch (error) {
    console.log("error in login user controller", error)
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpMessage.SERVER.INTERNAL_ERROR })
  }
}
module.exports = { signUp, verifyuser, loginUser }