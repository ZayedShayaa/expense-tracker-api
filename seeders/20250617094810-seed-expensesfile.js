'use strict';

module.exports = {
  async up(queryInterface) {
    const files = [
      {
        expense_id: 1,
        filename: 'office_supplies_receipt.pdf',
        file_url: 'https://expensetracker.s3.amazonaws.com/receipts/1.pdf',
        // uploaded_at: new Date('2023-01-05T12:30:00')
      },
      {
        expense_id: 3,
        filename: 'lunch_receipt.jpg',
        file_url: 'https://expensetracker.s3.amazonaws.com/receipts/3.jpg',
        // uploaded_at: new Date('2023-02-20T14:15:00')
      }
    ];

    await queryInterface.bulkInsert('expense_files', files, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('expense_files', null, {});
  }
};