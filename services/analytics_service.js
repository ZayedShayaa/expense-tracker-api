const { Expense, sequelize } = require("../models"); // تأكد من استيراد sequelize
const { Op } = require("sequelize");
const moment = require("moment");

class AnalyticsService {
  async getMonthlySummary(userId) {
    try {
      const oneYearAgo = moment().subtract(1, "year").toDate();

      const results = await Expense.findAll({
        attributes: [
          [sequelize.literal("DATE_TRUNC('month', incurred_at)"), "month"],
          [sequelize.fn("SUM", sequelize.col("amount")), "total"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: {
          user_id: userId,
          incurred_at: {
            [Op.gte]: oneYearAgo,
            [Op.lte]: new Date(),
          },
          deleted_at: null,
        },
        group: [sequelize.literal("DATE_TRUNC('month', incurred_at)")],
        order: [[sequelize.literal("DATE_TRUNC('month', incurred_at)"), "ASC"]],
        raw: true,
      });

      return results.map((item) => ({
        ...item,
        month: moment(item.month).format("YYYY-MM"),
      }));
    } catch (err) {
      console.error("Analytics query failed:", err);
      throw new Error("Database query error");
    }
  }

  async getCategorySpending(userId, from, to) {
    try {
      const results = await Expense.findAll({
        attributes: [
          "category",
          [sequelize.fn("SUM", sequelize.col("amount")), "total"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: {
          user_id: userId,
          incurred_at: {
            [Op.between]: [from, to],
          },
          deleted_at: null,
        },
        group: ["category"],
        order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
        raw: true,
      });

      return results;
    } catch (err) {
      console.error("Category spending query failed:", err);
      throw new Error("Database query error");
    }
  }
}

module.exports = new AnalyticsService();
