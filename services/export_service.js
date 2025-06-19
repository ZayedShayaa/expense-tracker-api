const { Expense } = require("../models");
const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const fs = require("fs").promises;
const path = require("path");
const { addEmailJob } = require("./queue_service");

class ExportService {
  async generateCSV(userId, { from, to, email }) {
    try {
      // 1. جلب البيانات الفعلية من قاعدة البيانات
      const expenses = await Expense.findAll({
        where: {
          user_id: userId,
          incurred_at: {
            [Op.between]: [new Date(from), new Date(to)],
          },
          deleted_at: null,
        },
        order: [["incurred_at", "ASC"]],
        raw: true,
      });

      if (expenses.length === 0) {
        throw new Error("No expenses found for the selected period");
      }

      // 2. تحويل البيانات إلى CSV
      const fields = [
        { label: "Date", value: "incurred_at" },
        { label: "Category", value: "category" },
        { label: "Description", value: "description" },
        {
          label: "Amount",
          value: (row) => parseFloat(row.amount).toFixed(2),
        },
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(expenses);

      // 3. حفظ الملف
      const filename = `expense_report_${userId}_${Date.now()}.csv`;
      const filePath = path.join(__dirname, "../exports", filename);

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, csv);

      // 4. إرسال بالبريد أو إرجاع رابط التحميل
      if (email) {
        await addEmailJob({
          email,
          subject: `Expense Report (${from} to ${to})`,
          text: "Attached is your expense report.",
          attachments: [
            {
              filename,
              path: filePath,
            },
          ],
        });

        return { sentToEmail: true };
      }

      return {
        sentToEmail: false,
        downloadUrl: `/exports/download/${filename}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    } catch (err) {
      console.error("Export failed:", err);
      throw err;
    }
  }
}

module.exports = new ExportService();
