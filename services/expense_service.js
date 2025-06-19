const { Expense } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

class ExpenseService {
  async createExpense(expenseData) {
    try {
      return await Expense.create(expenseData);
    } catch (err) {
      throw new ApiError(400, "Failed to create expense");
    }
  }

  async getUserExpenses(userId, { page, limit, category, fromDate, toDate }) {
    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (category) where.category = category;
    if (fromDate && toDate) {
      where.incurred_at = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    }

    return await Expense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["incurred_at", "DESC"]],
    });
  }

  async getExpenseById(id, userId) {
    const expense = await Expense.findOne({
      where: { id, user_id: userId },
    });
    if (!expense) throw new ApiError(404, "Expense not found");
    return expense;
  }

  async updateExpense(id, userId, updateData) {
    const expense = await this.getExpenseById(id, userId);
    return await expense.update(updateData);
  }

  async deleteExpense(id, userId) {
    const expense = await this.getExpenseById(id, userId);
    return await expense.destroy();
  }
}

module.exports = new ExpenseService();
