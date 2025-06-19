const Queue = require("bull");
const emailService = require("./email_service");

const fileProcessingQueue = new Queue("file-processing", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Queue لإرسال الإيميلات
const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// تعريف معالجة ملفات التحميل
fileProcessingQueue.process(async (job) => {
  console.log(`Processing file ${job.data.fileId} at path ${job.data.path}`);

  // هنا تضيف منطق معالجة الملف مثل فحص الفيروسات أو إنشاء صور مصغرة
  // await doVirusScan(job.data.path);
  // await createThumbnail(job.data.path);

  return { success: true };
});
// معالجة إرسال البريد الإلكتروني
emailQueue.process(async (job) => {
  const { email, subject, text, attachments } = job.data;
  await emailService.sendEmail(email, subject, text, attachments);
}); // وظائف لإضافة المهام إلى الطوابير
module.exports = {
  fileProcessingQueue,
  addEmailJob: (data) => emailQueue.add(data),
};
