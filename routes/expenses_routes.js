const express = require('express');
const router = express.Router();
const { authenticate  } = require('../middlewares/auth_middleware');
const ExpenseController = require('../controllers/expenses_controller');
const upload = require('../middlewares/upload_middleware');

// Apply authentication middleware to all expense routes
router.use(authenticate);

// Create a new expense
router.post('/', ExpenseController.createExpense);

// Get all user expenses with optional filtering
router.get('/', ExpenseController.getExpenses);

// Get a specific expense by ID
router.get('/:id', ExpenseController.getExpense);

// Update an expense
router.patch('/:id', ExpenseController.updateExpense);

// Delete an expense (soft delete)
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;
