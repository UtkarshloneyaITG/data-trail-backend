const express = require("express");
const { signUp, verifyuser, loginUser } = require("../controller/auth.controller");
const requireAuth = require("../middlewares/auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/signup").post(signUp)
router.route("/varify").post(verifyuser)
router.route("/login").post(authMiddleware, loginUser)
router.route("/profile").get(authMiddleware, (req, res) => {
  return res.json({
    status: true,
    userId: req.user_Id,   // ✅ CORRECT
    message: "Authenticated",
  });
});
module.exports = router