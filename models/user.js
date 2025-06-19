const { DataTypes } = require("sequelize");
// const bcrypt = require('bcrypt');
const bcrypt = require("bcryptjs");
const sequelize = require("../config/connect");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [2, 50] },
    },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    underscored: true,
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
  }
);

async function hashPassword(user) {
  if (user.changed("password_hash")) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
}

User.prototype.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;
