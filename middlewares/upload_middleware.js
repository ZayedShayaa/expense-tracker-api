const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// تهيئة تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// تصفية أنواع الملفات المسموح بها
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, 'Error: Only images (JPEG, JPG, PNG) and PDF files are allowed!'), false);
  }
};

// تهيئة multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_UPLOAD) * 1024 * 1024 || 5 * 1024 * 1024 // 5MB كحد افتراضي
  }
});

// Middleware للتحقق من وجود ملف
const checkFileUpload = (fieldName) => (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, `Please upload a ${fieldName} file`));
  }
  next();
};

module.exports = {
  upload,
  checkFileUpload
};