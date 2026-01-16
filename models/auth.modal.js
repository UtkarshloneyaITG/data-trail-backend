const { DataTypes, Model, sql } = require('@sequelize/core');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

class User extends Model {
  // Method to check password
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Virtual Getter: This calculates the boolean on the fly
  get isVerified() {
    if (!this.verifiedAt) return false;
    const expiryDate = new Date(this.verifiedAt);
    expiryDate.setDate(expiryDate.getDate() + 25); // Add 25 days duration
    // Returns true if current date is still before the expiry date
    return new Date() < expiryDate;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sql.uuidV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The actual database column storing the "start date" of verification
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    // Ensure virtuals are included when sending JSON to frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fix: Correct Sequelize v7 Hook syntax
User.addHook('beforeCreate', async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;