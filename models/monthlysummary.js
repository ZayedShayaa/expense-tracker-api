const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect");

const MonthlySummary = sequelize.define(
  "MonthlySummary",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 12 },
    },
    year: { type: DataTypes.INTEGER, allowNull: false },
    total_spent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    most_spent_category: { type: DataTypes.STRING },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "monthly_summaries",
    timestamps: false,
    underscored: true,
  }
);

module.exports = MonthlySummary;
