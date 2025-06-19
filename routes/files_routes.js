const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files_controller');
const { authenticate } = require('../middlewares/auth_middleware');
const { upload, checkFileUpload } = require('../middlewares/upload_middleware');

router.use(authenticate);

router.post('/:expenseId/files', upload.single('file'), checkFileUpload('file'),
  filesController.uploadFile
);

router.get(
  '/:expenseId/files/:fileId',
  filesController.downloadFile
);

router.delete(
  '/:expenseId/files/:fileId',
  filesController.deleteFile
);

module.exports = router;
