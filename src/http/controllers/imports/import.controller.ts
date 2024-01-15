import { NextFunction, Request, Response } from 'express';
import {
  FormatNotSupportedError,
  NotFoundError,
} from '../../../helpers/Errors';
import { prisma } from '../../../lib/prisma';
import importQueue from '../../../queue/queue';

// Calcular MRR para assinantes ativos

class ImportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new NotFoundError('File not found');
      }

      const acceptedFormats = ['csv', 'xlsx'];

      const fileFormat = file.originalname.split('.')[1];

      if (!acceptedFormats.includes(fileFormat)) {
        throw new FormatNotSupportedError(
          'Formato de arquivo não suportado, envie um arquivo .csv ou .xlsx'
        );
      }

      const subscriptionsImport = await prisma.imports.create({
        data: {
          name: file.originalname,
          import_status: 'IN_PROGRESS',
        },
      });

      if (!subscriptionsImport) {
        throw new NotFoundError('Importa não iniciada');
      }

      importQueue.add({ import_id: subscriptionsImport.id, file });

      res.status(200).json({
        message: 'Importação iniciada',
        import: subscriptionsImport,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default ImportController;
