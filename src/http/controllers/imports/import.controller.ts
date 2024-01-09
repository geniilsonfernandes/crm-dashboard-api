import { NextFunction, Request, Response } from 'express';
import { ImportError, NotFoundError } from '../../../helpers/Errors';
import { prisma } from '../../../lib/prisma';
import processExcel from '../../../utils/processExcel';

// Calcular MRR para assinantes ativos

class ImportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new NotFoundError('File not found');
      }

      const data = await processExcel(file.path);

      await prisma.$transaction(async (prisma) => {
        try {
          const subscriptionsImport = await prisma.imports.create({
            data: {
              name: file.originalname,
            },
          });

          const addIDs = data.map((entry) => ({
            ...entry,
            import_id: subscriptionsImport.id,
          }));

          await prisma.subscriptions.createMany({
            data: addIDs,
          });

          return 'Transação realizada com sucesso';
        } catch (error) {
          throw new ImportError(`Erro ao importar arquivo: ${error}`);
        }
      });

      res.status(200).json({
        message: 'Importação concluída',
        code: 200,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default ImportController;
