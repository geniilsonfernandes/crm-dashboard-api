import { NextFunction, Request, Response } from 'express';
import { ImportError, NotFoundError } from '../../../helpers/Errors';
import { prisma } from '../../../lib/prisma';
import sanitizeExcel from '../../../utils/sanitizeExcel';

// Calcular MRR para assinantes ativos

class ImportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new NotFoundError('File not found');
      }

      const sanitizeData = await sanitizeExcel(file.path);

      const transaction = await prisma.$transaction(async (prisma) => {
        try {
          const subscriptionsImport = await prisma.imports.create({
            data: {
              name: file.originalname,
            },
          });

          const include_import_id = sanitizeData.map((entry) => ({
            ...entry,
            import_id: subscriptionsImport.id,
          }));

          await prisma.subscriptions.createMany({
            data: include_import_id,
          });

          return {
            import: subscriptionsImport,
            subscriptions: include_import_id,
          };
        } catch (error) {
          throw new ImportError(`Erro ao importar arquivo: ${error}`);
        }
      });

      res.status(200).json({
        message: 'Importação concluída',
        code: 200,
        success: true,
        inport_id: transaction.import.id,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default ImportController;
