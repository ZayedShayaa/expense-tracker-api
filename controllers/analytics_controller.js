const analyticsService = require("../services/analytics_service");
const ApiError = require("../utils/ApiError");

class AnalyticsController {
  async getMonthlySummary(req, res, next) {
    try {
      const results = await analyticsService.getMonthlySummary(req.user.id);
      res.json({
        success: true,
        data: results,
      });
    } catch (err) {
      console.error("Analytics error:", err);
      next(new ApiError(500, "Failed to process analytics request"));
    }
  }

  async getCategorySpending(req, res, next) {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        throw new ApiError(400, "Date range is required");
      }

      const results = await analyticsService.getCategorySpending(
        req.user.id,
        new Date(from),
        new Date(to)
      );

      res.json({
  success: true,
  data: results,
});
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
