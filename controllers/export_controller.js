const exportService = require('../services/export_service');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');


class ExportController {
  async exportExpenses(req, res, next) {
    try {
      const { from, to, email } = req.query;

      if (!from || !to) {
        throw new ApiError(400, 'Date range is required');
      }

      const result = await exportService.generateCSV(req.user.id, { from, to, email });

      if (result.sentToEmail) {
        return res.json({ 
          success: true,
          message: 'Report will be sent to your email shortly'
        });
      }

      res.json({
        success: true,
        downloadUrl: result.downloadUrl,
        expiresAt: result.expiresAt
      });
    } catch (err) {
      next(err);
    }
  }

  async downloadExport(req, res, next) {
    try {
      const filePath = path.join(__dirname, '../exports', req.params.filename);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename="expenses-report-${req.params.filename}"`
      );

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Download failed:', err);
          return res.status(404).json({ error: 'File not found' });
        }

        // حذف الملف بعد التنزيل (اختياري)
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error(unlinkErr);
        });
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExportController();
