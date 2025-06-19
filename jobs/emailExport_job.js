const Queue = require('bull');
const emailQueue = new Queue('email-queue', {
  redis: { host: '127.0.0.1', port: 6379 }
});

// معالجة إرسال البريد
emailQueue.process(async (job) => {
  const { email, subject, text, attachments } = job.data;
  await emailService.sendEmail(email, subject, text, attachments);
});

module.exports = {
  addEmailJob: (data) => emailQueue.add(data)
};
