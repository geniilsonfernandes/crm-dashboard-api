import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../../../lib/prisma';

export const subscriptionsSchema = z.object({
  query: z.object({
    import_id: z.string({
      description: 'Import id must be a valid uuid',
    }),
    page_number: z.string({
      description: 'Page must be a number',
    }),
    per_page: z.string({
      description: 'Per page must be a number',
    }),
  }),
});

class SubscriptionsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { import_id, page_number, per_page } = req.query as z.infer<
        typeof subscriptionsSchema
      >['query'];

      const imports = await prisma.subscriptions.findMany({
        where: {
          import_id,
        },
        take: Number(per_page) || 10,
        skip: Number(page_number || 1) * 10,
      });

      const total = await prisma.subscriptions.count({ where: { import_id } });
      res.status(200).json({
        data: imports,
        meta: {
          total,
          per_page: Number(per_page || 10),
          total_pages:
            total % Number(per_page || 10) === 0
              ? total / Number(per_page || 10)
              : Math.floor(total / Number(per_page || 10)) + 1,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}

export default SubscriptionsController;
