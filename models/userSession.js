const { DataTypes, Model, sql } = require("@sequelize/core");
const sequelize = require("../config/db");

class UserSession extends Model { }

UserSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sql.uuidV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_sessions",
    modelName: "UserSession",
    timestamps: true,
  }
);

module.exports = UserSession;