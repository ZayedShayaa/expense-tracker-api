const fileProcessingQueue = require("../services/queue_service");

fileProcessingQueue.process(async (job) => {
  console.log(`Processing file ${job.data.fileId} at path ${job.data.path}`);

  // هنا ضع منطق معالجة الملف مثل فحص فيروسات أو إنشاء ثامبنييل
  // await doVirusScan(job.data.path);
  // await createThumbnail(job.data.path);

  return { success: true };
});
