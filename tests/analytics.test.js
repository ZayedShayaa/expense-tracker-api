const analyticsController = require("../controllers/analytics_controller");
const analyticsService = require("../services/analytics_service");
const ApiError = require("../utils/ApiError");

// Mock بيانات وهمية
const mockReq = (userId = 1, query = {}) => ({
  user: { id: userId },
  query,
});
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

jest.mock("../services/analytics_service");

describe("AnalyticsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMonthlySummary", () => {
    it("should return summary data successfully", async () => {
      const req = mockReq();
      const res = mockRes();
      const data = [{ month: "2025-01", total: "100.00", count: 2 }];
      analyticsService.getMonthlySummary.mockResolvedValue(data);

      await analyticsController.getMonthlySummary(req, res, mockNext);

      expect(analyticsService.getMonthlySummary).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("should handle errors and call next with ApiError", async () => {
      const req = mockReq();
      const res = mockRes();
      const error = new Error("DB error");
      analyticsService.getMonthlySummary.mockRejectedValue(error);

      await analyticsController.getMonthlySummary(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe("getCategorySpending", () => {
    it("should return category data successfully", async () => {
      const req = mockReq(1, { from: "2025-01-01", to: "2025-06-01" });
      const res = mockRes();
      const data = [{ category: "Food", total: "50.00", count: 3 }];
      analyticsService.getCategorySpending.mockResolvedValue(data);

      await analyticsController.getCategorySpending(req, res, mockNext);

      expect(analyticsService.getCategorySpending).toHaveBeenCalledWith(
        1,
        new Date("2025-01-01"),
        new Date("2025-06-01")
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("should return 400 if date range missing", async () => {
      const req = mockReq(1, { from: "2025-01-01" }); // missing 'to'
      const res = mockRes();

      await analyticsController.getCategorySpending(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it("should handle errors and call next with error", async () => {
      const req = mockReq(1, { from: "2025-01-01", to: "2025-06-01" });
      const res = mockRes();
      const error = new Error("Something failed");
      analyticsService.getCategorySpending.mockRejectedValue(error);

      await analyticsController.getCategorySpending(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
