"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const saltRounds = 10;
    const users = [
      {
        name: "Admin User",
        email: "admin@expensetracker.com",
        password_hash: await bcrypt.hash("Admin@123", saltRounds),
      },
      {
        name: "Zayed Shayaa",
        email: "zayedshayaa@example.com",
        password_hash: await bcrypt.hash("zayed@2025", saltRounds),
      },
    ];

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
