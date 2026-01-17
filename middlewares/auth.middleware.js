const { loginUser } = require("../controller/auth.controller");
const { UserSession } = require("../models");
const { Op } = require("@sequelize/core");

module.exports = async function auth(req, res, next) {
  try {
    const sid = req.cookies.sid;
    console.log(req.cookies, "----------------");

    // ❗ Only allow loginUser to be called on LOGIN route
    if (!sid) {
      return handleNoSession(req, res, next);
    }

    const session = await UserSession.findOne({
      where: {
        id: sid,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!session) {
      res.clearCookie("sid");
      return handleNoSession(req, res, next);
    }

    req.userId = session.user_id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return handleNoSession(req, res, next);
  }
};

function handleNoSession(req, res, next) {
  // ✅ If this IS the login request, allow controller to run
  if (req.path === "/login" && req.method === "POST") {
    return loginUser(req, res);
  }

  // ❌ Any other request without session is unauthorized
  return res.status(401).json({
    status: false,
    message: "Session not found. Please login.",
  });
}
