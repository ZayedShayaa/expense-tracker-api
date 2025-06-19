const request = require('supertest');
const express = require('express');
const multer = require('multer');
const filesController = require('../controllers/files_controller');

// Mock dependencies
jest.mock('../services/file_service');
jest.mock('../services/queue_service', () => ({
  add: jest.fn()
}));
const filesService = require('../services/file_service');
const fileProcessingQueue = require('../services/queue_service');

const app = express();
app.use(express.json());

// إعداد multer وهمي
const storage = multer.memoryStorage();
const upload = multer({ storage });

// إعداد الراوت
app.post(
  '/:expenseId/files',
  upload.single('file'),
  async (req, res, next) => {
    try {
      await filesController.uploadFile(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

// ✅ إضافة Middleware لمعالجة الأخطاء
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message });
});

describe('FilesController - uploadFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file and return 201 with file data', async () => {
    const fakeFile = {
      id: 1,
      expense_id: '123',
      filename: 'test.pdf',
      file_url: 'uploads/test.pdf',
      uploaded_at: new Date(),
    };

    filesService.createFile.mockResolvedValue(fakeFile);

    const res = await request(app)
      .post('/123/files')
      .attach('file', Buffer.from('dummy file content'), 'test.pdf');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('filename', 'test.pdf');
    expect(filesService.createFile).toHaveBeenCalled();
    expect(fileProcessingQueue.add).toHaveBeenCalled();
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/123/files');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no file uploaded/i);
  });
});
