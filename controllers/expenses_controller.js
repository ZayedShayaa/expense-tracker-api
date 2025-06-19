const ExpenseService = require("../services/expense_service");
const ApiError = require("../utils/ApiError");

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const expenseData = {
        ...req.body,
        user_id: req.user.id, // نأخذ user_id من المستخدم المسجل دخوله
      };
      const expense = await ExpenseService.createExpense(expenseData);
      res.status(201).json(expense);
    } catch (err) {
      next(err);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const { page = 1, limit = 10, category, from, to } = req.query;
      const expenses = await ExpenseService.getUserExpenses(req.user.id, {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        fromDate: from,
        toDate: to,
      });
      res.json(expenses);
    } catch (err) {
      next(err);
    }
  }

  async getExpense(req, res, next) {
    try {
      const expense = await ExpenseService.getExpenseById(
        req.params.id,
        req.user.id
      );
      res.json(expense);
    } catch (err) {
      next(err);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const expense = await ExpenseService.updateExpense(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(expense);
    } catch (err) {
      next(err);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      await ExpenseService.deleteExpense(req.params.id, req.user.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExpenseController();
