const { Model, DataTypes, sql } = require('@sequelize/core');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('./auth.modal'); // import User model

class OTP extends Model {
  async validateOtp(otp) {
    return bcrypt.compare(otp, this.otp);
  }
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sql.uuidV4,
      primaryKey: true,
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },

    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE', // delete OTPs if user is deleted
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: false, // we already have createdAt
  }
);
OTP.addHook('beforeCreate', async (ver) => {
  if (ver.otp) {
    ver.otp = await bcrypt.hash(ver.otp, 10);
  }
});

// Optional: define association
User.hasMany(OTP, { foreignKey: 'userId', as: 'otps' });
OTP.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = OTP;