const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/connect");

const Expense = sequelize.define(
  "Expense",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: { type: DataTypes.TEXT },
    incurred_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    tableName: "expenses",
    timestamps: false,
    underscored: true,
    paranoid: true,
    deletedAt: "deleted_at",
    defaultScope: { attributes: { exclude: ["deleted_at"] } },
    scopes: {
      withDeleted: { paranoid: false },
      byCategory: (category) => ({ where: { category } }),
      dateRange: (start, end) => ({
        where: { incurred_at: { [Op.between]: [start, end] } },
      }),
    },
  }
);

module.exports = Expense;
