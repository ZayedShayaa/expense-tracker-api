const ApiError = require("../utils/ApiError");
const filesService = require("../services/file_service");
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const path = require("path");
const fileProcessingQueue = require("../services/queue_service");

class FilesController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const fileRecord = await filesService.createFile({
        expense_id: req.params.expenseId,
        filename: req.file.originalname,
        file_url: `uploads/${req.file.filename}`, // تأكد أن هذا مسار نسبي فقط
        uploaded_at: new Date(),
      });
      // أضف المهمة إلى طابور المعالجة الخلفية
      await fileProcessingQueue.add({
        fileId: fileRecord.id,
        path: req.file.path,
      });

      res.status(201).json(fileRecord);
    } catch (err) {
      next(err);
    }
  }

  async downloadFile(req, res, next) {
    try {
      const file = await filesService.getFile(
        req.params.fileId,
        req.params.expenseId
      );

      if (!file) {
        throw new ApiError(404, "File not found");
      }

      // استخراج المسار النسبي إذا كان file_url يحتوي على URL كامل
      let relativePath = file.file_url;
      if (file.file_url.startsWith(baseUrl)) {
        relativePath = file.file_url.replace(baseUrl, "");
      }

      const filePath = path.join(__dirname, "..", relativePath);
      res.download(filePath, file.filename);
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req, res, next) {
    try {
      await filesService.deleteFile(req.params.fileId, req.params.expenseId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FilesController();
