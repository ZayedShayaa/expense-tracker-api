const { Sequelize } = require('sequelize');
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
});

module.exports = sequelize;











// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv").config();


// // Create Sequelize instance with PostgreSQL connection
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.DB_HOST || "localhost",
//   port: process.env.DB_PORT || 5432,
//   database: process.env.DB_NAME || "expense_tracker",
//   username: process.env.DB_USER || "postgres",
//   password: process.env.DB_PASSWORD || "chatapp",

//   define: {
//     timestamps: true, // Enable automatic timestamp fields (created_at, updated_at)
//     underscored: true, // Use snake_case instead of camelCase for column names
//     paranoid: true, // Enable soft deletes
//     deletedAt: "deleted_at", // Field name for soft delete
//   },
// });

// // Test database connection
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log(" Database connection successfully");
//   } catch (error) {
//     console.error(" Failed to connect to database:", error.message);
//     process.exit(1); // Exit application on connection failure
//   }
// }

// testConnection();

// module.exports = sequelize;
