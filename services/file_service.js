const { ExpenseFile } = require('../models');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

class FilesService {
  async createFile(fileData) {
    try {
      return await ExpenseFile.create(fileData);
    } catch (err) {
       console.error('Error in createFile:', err);
      throw new ApiError(500, 'Failed to save file record');
    }
  }

  async getFile(fileId, expenseId) {
    const file = await ExpenseFile.findOne({
      where: { id: fileId, expense_id: expenseId }
    });

    if (!file) {
      throw new ApiError(404, 'File not found');
    }

    return file;
  }

  async deleteFile(fileId, expenseId) {
    const file = await this.getFile(fileId, expenseId);

    const filePath = path.join(__dirname, '..', file.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await file.destroy();
  }
}

module.exports = new FilesService();