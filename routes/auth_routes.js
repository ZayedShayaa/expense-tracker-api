const express = require('express');
const router = express.Router();
const authController = require('../controllers//auth_controller');
const { authenticate } = require('../middlewares/auth_middleware');
const validate = require('../middlewares/validate_middleware');
const { 
  registerSchema, 
  loginSchema 
} = require('../validations/auth_validation');

// POST /auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// GET /auth/profile (Protected route)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;