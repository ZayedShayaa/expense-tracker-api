const { 
  hashPassword, 
  comparePassword,
  generateToken,
  verifyToken 
} = require('../config/auth');
const authService = require('../services/auth_service');
const User = require('../models/user');
const ApiError = require('../utils/ApiError');

// Mocking dependencies
jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Configuration', () => {
  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      require('bcrypt').hash.mockResolvedValue('hashed_password');
      
      const result = await hashPassword('password123');
      expect(result).toBe('hashed_password');
      expect(require('bcrypt').hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      require('bcrypt').compare.mockResolvedValue(true);
      
      const result = await comparePassword('password123', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      require('bcrypt').compare.mockResolvedValue(false);
      
      const result = await comparePassword('wrong', 'hashed_password');
      expect(result).toBe(false);
    });
  });

  describe('JWT Functions', () => {
    const testPayload = { id: 1, role: 'user' };

    it('should generate valid token', () => {
      require('jsonwebtoken').sign.mockReturnValue('test_token');
      
      const token = generateToken(testPayload);
      expect(token).toBe('test_token');
      expect(require('jsonwebtoken').sign).toHaveBeenCalledWith(
        testPayload, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    });

    it('should verify valid token', () => {
      require('jsonwebtoken').verify.mockReturnValue(testPayload);
      
      const payload = verifyToken('test_token');
      expect(payload).toEqual(testPayload);
    });

    it('should throw error for invalid token', () => {
      require('jsonwebtoken').verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      expect(() => verifyToken('bad_token')).toThrow('Invalid token');
    });
  });
});

describe('Auth Service', () => {
  const testUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password_hash: 'hashed_password'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(testUser);
      require('bcrypt').hash.mockResolvedValue('hashed_password');
      require('jsonwebtoken').sign.mockReturnValue('test_token');

      const result = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        token: 'test_token'
      });
    });

    it('should throw error for duplicate email', async () => {
      User.findOne.mockResolvedValue(testUser);
      
      await expect(authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Email is already in use');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      User.findOne.mockResolvedValue(testUser);
      require('bcrypt').compare.mockResolvedValue(true);
      require('jsonwebtoken').sign.mockReturnValue('test_token');

      const result = await authService.login('test@example.com', 'password123');
      
      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        token: 'test_token'
      });
    });

    it('should throw error for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);
      
      await expect(authService.login('wrong@example.com', 'password123'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      User.findOne.mockResolvedValue(testUser);
      require('bcrypt').compare.mockResolvedValue(false);
      
      await expect(authService.login('test@example.com', 'wrong_password'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});

describe('Auth Middleware', () => {
  const mockRequest = (headers = {}) => ({
    header: jest.fn().mockImplementation(name => headers[name])
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  describe('authenticate', () => {
    const { authenticate } = require('../middlewares/auth_middleware');

    it('should authenticate valid token', () => {
      const req = mockRequest({
        'Authorization': 'Bearer valid_token'
      });
      const res = mockResponse();
      
      require('jsonwebtoken').verify.mockReturnValue({ id: 1 });
      authenticate(req, res, next);
      
      expect(req.user).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });

    it('should reject missing token', () => {
      const req = mockRequest();
      const res = mockResponse();
      
      authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required. Please provide a token.'
      });
    });

    it('should reject invalid token', () => {
      const req = mockRequest({
        'Authorization': 'Bearer invalid_token'
      });
      const res = mockResponse();
      
      require('jsonwebtoken').verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token.'
      });
    });
  });

  describe('authorize', () => {
    const { authorize } = require('../middlewares/auth_middleware');

    it('should allow access for authorized role', () => {
      const req = { user: { role: 'admin' } };
      const res = mockResponse();
      const middleware = authorize(['admin', 'user']);
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });

    it('should reject access for unauthorized role', () => {
      const req = { user: { role: 'guest' } };
      const res = mockResponse();
      const middleware = authorize(['admin', 'user']);
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You are not authorized to access this resource.'
      });
    });
  });
});