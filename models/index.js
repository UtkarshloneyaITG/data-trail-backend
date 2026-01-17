const sequelize = require("../config/db");
const { DataTypes } = require("@sequelize/core");
const User = require("./auth.modal")
const UserSession = require("./userSession")

User.hasMany(UserSession, { foreignKey: "user_id" });
UserSession.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  UserSession,
};
