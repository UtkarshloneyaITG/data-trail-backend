const express = require("express");
const { signUp, verifyuser, loginUser } = require("../controller/auth.controller");
const router = express.Router();

router.route("/signup").post(signUp)
router.route("/varify").post(verifyuser)
router.route("/login").post(loginUser)
module.exports = router