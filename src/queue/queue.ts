import Queue from 'bull';
import sanitizeExcel from '../utils/sanitizeExcel';
import { prisma } from '../lib/prisma';

const importQueue = new Queue('importQueue', {
  redis: {
    host: 'redis',
    port: 6379,
    maxRetriesPerRequest: 3,
  },
});

importQueue.process(async (job) => {
  const { import_id, file } = job.data;

  const sanitizeData = await sanitizeExcel(file.path);

  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const include_import_id = sanitizeData.map((entry) => ({
        ...entry,
        import_id: import_id,
      }));

      await prisma.subscriptions.createMany({
        data: include_import_id,
      });

      return 'suscess';
    } catch (error) {
      return 'fail';
    }
  });

  await prisma.imports.update({
    where: {
      id: import_id,
    },
    data: {
      import_status: transaction === 'suscess' ? 'COMPLETED' : 'FAILED',
    },
  });
  return {
    import: import_id,
  };
});
importQueue.on('error', (error) => {
  console.error('Erro na conexão com o Redis:', error);
});

importQueue.on('active', (job) => {
  console.log(`Job ${job.id} active`);
});

importQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

export default importQueue;
