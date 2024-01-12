import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { NotFoundError } from '../../../helpers/Errors';
import { prisma } from '../../../lib/prisma';
import countMRRSubscriptionsByYear from '../../../utils/countMRRSubscriptionsByYear';

export const analyticsMRRSchema = z.object({
  query: z.object({
    import_id: z.string({
      description: 'Import id must be a valid uuid',
    }),
    year: z.string({
      description: 'Year must be a valid',
    }),
  }),
});

class AnalyticsMRRController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { import_id, year } = req.query as z.infer<
      typeof analyticsMRRSchema
    >['query'];

    try {
      const findImport = await prisma.imports.findFirst({
        where: {
          id: import_id,
        },
      });

      if (!year) {
        throw new NotFoundError('Year not found');
      }

      if (!findImport) {
        throw new NotFoundError('Import not found');
      }

      const subscriptions = await prisma.subscriptions.findMany({
        where: {
          import_id: import_id,
        },
      });

      const analytics_MRR = countMRRSubscriptionsByYear(subscriptions, year);
      const analytics = {
        mrr_month: analytics_MRR.mrrPerMonth,
        active_customers_month: analytics_MRR.activeSubscriptionsByMonth,
        chrunRatePerMonth: analytics_MRR.chrunRatePerMonth,
      };

      res.status(200).json({ analytics, inport: findImport, subscriptions });
    } catch (e) {
      next(e);
    }
  }
}

export default AnalyticsMRRController;
