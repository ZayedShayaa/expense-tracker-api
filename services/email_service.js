const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,  // لأنك تستخدم 2525 أو 587، هذه المنافذ غير مشفرة SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

class EmailService {
  async sendEmail(to, subject, text, attachments = []) {
    try {
      await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        text,
        attachments
      });
      console.log(`Email sent to ${to}`);
      return true;
    } catch (err) {
      console.error('Email sending failed:', err);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();
