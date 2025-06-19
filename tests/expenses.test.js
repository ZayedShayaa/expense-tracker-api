const ExpenseController = require('../controllers/expenses_controller');
const ExpenseService = require('../services/expense_service');
const ApiError = require('../utils/ApiError');

// Mock the ExpenseService
jest.mock('../services/expense_service');

describe('ExpenseController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      user: { id: 1 },
      body: {},
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('createExpense', () => {
    it('should create a new expense and return 201 status', async () => {
      const expenseData = {
        amount: 100,
        category: 'food',
        description: 'Dinner',
        user_id: 1
      };
      
      const mockExpense = { id: 1, ...expenseData };
      
      req.body = {
        amount: 100,
        category: 'food',
        description: 'Dinner'
      };
      
      ExpenseService.createExpense.mockResolvedValue(mockExpense);
      
      await ExpenseController.createExpense(req, res, next);
      
      expect(ExpenseService.createExpense).toHaveBeenCalledWith(expenseData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockExpense);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when creation fails', async () => {
      const error = new ApiError(400, 'Failed to create expense');
      
      req.body = {
        amount: 100,
        category: 'food'
      };
      
      ExpenseService.createExpense.mockRejectedValue(error);
      
      await ExpenseController.createExpense(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getExpenses', () => {
    it('should get expenses with default pagination', async () => {
      const mockExpenses = {
        count: 2,
        rows: [
          { id: 1, amount: 100, category: 'food' },
          { id: 2, amount: 200, category: 'transport' }
        ]
      };
      
      ExpenseService.getUserExpenses.mockResolvedValue(mockExpenses);
      
      await ExpenseController.getExpenses(req, res, next);
      
      expect(ExpenseService.getUserExpenses).toHaveBeenCalledWith(1, {
        page: 1,
        limit: 10,
        category: undefined,
        fromDate: undefined,
        toDate: undefined
      });
      expect(res.json).toHaveBeenCalledWith(mockExpenses);
      expect(next).not.toHaveBeenCalled();
    });

    it('should get expenses with custom pagination and filters', async () => {
      const mockExpenses = {
        count: 1,
        rows: [{ id: 1, amount: 100, category: 'food' }]
      };
      
      req.query = {
        page: '2',
        limit: '5',
        category: 'food',
        from: '2023-01-01',
        to: '2023-01-31'
      };
      
      ExpenseService.getUserExpenses.mockResolvedValue(mockExpenses);
      
      await ExpenseController.getExpenses(req, res, next);
      
      expect(ExpenseService.getUserExpenses).toHaveBeenCalledWith(1, {
        page: 2,
        limit: 5,
        category: 'food',
        fromDate: '2023-01-01',
        toDate: '2023-01-31'
      });
      expect(res.json).toHaveBeenCalledWith(mockExpenses);
    });

    it('should call next with error when fetching fails', async () => {
      const error = new Error('Database error');
      
      ExpenseService.getUserExpenses.mockRejectedValue(error);
      
      await ExpenseController.getExpenses(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getExpense', () => {
    it('should get a specific expense by id', async () => {
      const mockExpense = { id: 1, amount: 100, category: 'food' };
      req.params.id = '1';
      
      ExpenseService.getExpenseById.mockResolvedValue(mockExpense);
      
      await ExpenseController.getExpense(req, res, next);
      
      expect(ExpenseService.getExpenseById).toHaveBeenCalledWith('1', 1);
      expect(res.json).toHaveBeenCalledWith(mockExpense);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with 404 error when expense not found', async () => {
      req.params.id = '999';
      
      const error = new ApiError(404, 'Expense not found');
      ExpenseService.getExpenseById.mockRejectedValue(error);
      
      await ExpenseController.getExpense(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense', async () => {
      const updatedExpense = { id: 1, amount: 150, category: 'food' };
      req.params.id = '1';
      req.body = { amount: 150 };
      
      ExpenseService.updateExpense.mockResolvedValue(updatedExpense);
      
      await ExpenseController.updateExpense(req, res, next);
      
      expect(ExpenseService.updateExpense).toHaveBeenCalledWith('1', 1, { amount: 150 });
      expect(res.json).toHaveBeenCalledWith(updatedExpense);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when update fails', async () => {
      req.params.id = '1';
      req.body = { amount: 150 };
      
      const error = new ApiError(400, 'Invalid data');
      ExpenseService.updateExpense.mockRejectedValue(error);
      
      await ExpenseController.updateExpense(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense and return 204 status', async () => {
      req.params.id = '1';
      
      ExpenseService.deleteExpense.mockResolvedValue(true);
      
      await ExpenseController.deleteExpense(req, res, next);
      
      expect(ExpenseService.deleteExpense).toHaveBeenCalledWith('1', 1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when deletion fails', async () => {
      req.params.id = '999';
      
      const error = new ApiError(404, 'Expense not found');
      ExpenseService.deleteExpense.mockRejectedValue(error);
      
      await ExpenseController.deleteExpense(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});