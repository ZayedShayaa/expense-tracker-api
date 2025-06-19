"use strict";

module.exports = {
  async up(queryInterface) {
      // Check if users with IDs 1 and 2 exist before seeding
const users = await queryInterface.sequelize.query(
  'SELECT id FROM users WHERE id IN (1, 2)',
  { type: queryInterface.sequelize.QueryTypes.SELECT }
);

if (users.length < 2) {
  throw new Error('Users must exist before running this seed!');
}
    const summaries = [
      {
        user_id: 1,
        month: new Date("2023-01-01"),
        total_amount: 240.74,
        category_data: JSON.stringify({ 
        'Office Supplies': 150.75,
        'Software': 89.99
      }),
       
      },
      {
        user_id: 2,
        month: new Date("2023-02-01"),
        total_amount: 165.5,
        category_data:JSON.stringify({
          'Dining': 45.5,
          'Travel': 120.0,
        }) ,
        
      },
    ];

    await queryInterface.bulkInsert("monthly_summary", summaries, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("monthly_summary", null, {});
  },
};
