class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // طريقة ثابتة لإنشاء خطأ Bad Request (400)
  static badRequest(message) {
    return new ApiError(400, message);
  }

  // طريقة ثابتة لإنشاء خطأ Unauthorized (401)
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  // طريقة ثابتة لإنشاء خطأ Forbidden (403)
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  // طريقة ثابتة لإنشاء خطأ Not Found (404)
  static notFound(message = 'Not Found') {
    return new ApiError(404, message);
  }

  // طريقة ثابتة لإنشاء خطأ Internal Server Error (500)
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;