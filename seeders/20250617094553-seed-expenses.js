"use strict";

module.exports = {
  async up(queryInterface) {
    const expenses = [
      // Admin user expenses
      {
        user_id: 1,
        amount: 150.75,
        category: "Office Supplies",
        description: "Printer ink and paper",
        incurred_at: new Date("2023-01-05"),
      },
      {
        user_id: 1,
        amount: 89.99,
        category: "Software",
        description: "Annual subscription",
        incurred_at: new Date("2023-01-15"),
      },

      // Zayed shayaa expenses
      {
        user_id: 2,
        amount: 45.5,
        category: "Dining",
        description: "Client lunch meeting",
        incurred_at: new Date("2023-02-20"),
      },
      {
        user_id: 2,
        amount: 120.0,
        category: "Travel",
        description: "Train tickets",
        incurred_at: new Date("2023-02-25"),
        deleted_at: new Date("2023-02-26"), // soft deleted
      },
    ];

    await queryInterface.bulkInsert("expenses", expenses, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("expenses", null, {});
  },
};
