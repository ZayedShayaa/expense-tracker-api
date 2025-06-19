const sequelize = require("../config/connect");
const User = require("./user");
const Expense = require("./expense");
const ExpenseFile = require("./expensefile");
const MonthlySummary = require("./monthlysummary");

User.hasMany(Expense, { foreignKey: "user_id" });
Expense.belongsTo(User, { foreignKey: "user_id" });

Expense.hasMany(ExpenseFile, { foreignKey: "expense_id" });
ExpenseFile.belongsTo(Expense, { foreignKey: "expense_id" });

User.hasMany(MonthlySummary, { foreignKey: "user_id" });
MonthlySummary.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, User, Expense, ExpenseFile, MonthlySummary };
