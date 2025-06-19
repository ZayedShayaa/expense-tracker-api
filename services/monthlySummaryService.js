const { Expense, MonthlySummary } = require("../models");
const { Op, Sequelize } = require("sequelize");

async function generateMonthlySummary(userId, year, month) {
  const expenses = await Expense.findAll({
    where: {
      user_id: userId,
      incurred_at: {
        [Op.and]: [
          { [Op.gte]: new Date(year, month - 1, 1) },
          { [Op.lt]: new Date(year, month, 1) },
        ],
      },
    },
  });

  const total_spent = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0
  );
  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = e.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(e.amount);
  });

  const most_spent_category = Object.keys(categoryTotals).reduce(
    (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
    null
  );

  const [summary, created] = await MonthlySummary.findOrCreate({
    where: { user_id: userId, year, month },
    defaults: { total_spent, most_spent_category, updated_at: new Date() },
  });

  if (!created) {
    summary.total_spent = total_spent;
    summary.most_spent_category = most_spent_category;
    summary.updated_at = new Date();
    await summary.save();
  }

  return summary;
}

module.exports = { generateMonthlySummary };
