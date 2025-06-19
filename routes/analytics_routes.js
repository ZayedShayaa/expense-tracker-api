const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics_controller");
const { authenticate } = require("../middlewares/auth_middleware");

router.use(authenticate);

// تحليلات شهرية
router.get("/monthly", analyticsController.getMonthlySummary);

// تحليلات حسب الفئة
router.get("/categories", analyticsController.getCategorySpending);

module.exports = router;
