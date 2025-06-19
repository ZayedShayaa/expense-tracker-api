const express = require('express');
const app = express();


// Import auth routes
const authRoutes = require("./routes/auth_routes");
const expenseRoutes = require('./routes/expenses_routes');
const filesRoutes = require('./routes/files_routes');
const analyticsRoutes = require('./routes/analytics_routes');
const exportRoutes = require('./routes/export_routes'); 
// Import middlewares

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/expenses', filesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
// After Route Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err);
 res.status(err.statusCode  || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
module.exports = app;