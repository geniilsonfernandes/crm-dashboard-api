import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

// Calcular MRR para assinantes ativos

class ImportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const imports = await prisma.imports.findMany({});

      res.status(200).json({
        data: imports,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default ImportController;
