const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export_controller');
const { authenticate } = require('../middlewares/auth_middleware');

router.use(authenticate);

router.get('/csv', exportController.exportExpenses);
router.get('/download/:filename', exportController.downloadExport);

module.exports = router;