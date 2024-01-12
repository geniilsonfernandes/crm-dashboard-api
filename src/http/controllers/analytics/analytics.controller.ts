import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { NotFoundError } from '../../../helpers/Errors';
import { prisma } from '../../../lib/prisma';
import avarageMMRSubscriptionsTotals from '../../../utils/avarageMMRSubscriptionsTotals';
import countSubscriptionStatuses from '../../../utils/countSubscriptionStatuses';

export const analyticsSchema = z.object({
  query: z.object({
    import_id: z.string({
      description: 'Import id must be a valid uuid',
    }),
  }),
});

class AnalyticsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { import_id } = req.query as z.infer<typeof analyticsSchema>['query'];

    try {
      const findImport = await prisma.imports.findFirst({
        where: {
          id: import_id,
        },
      });

      if (!findImport) {
        throw new NotFoundError('Import not found');
      }

      const subscriptions = await prisma.subscriptions.findMany({
        where: {
          import_id: import_id,
        },
      });

      const active_customers_by_plan = subscriptions.reduce(
        (acc, curr) => {
          if (curr.status === 'Ativa') {
            if (!acc[curr.periodicity]) {
              acc[curr.periodicity] = 0;
            }

            acc[curr.periodicity] = (acc[curr.periodicity] || 0) + 1;
          }

          return acc;
        },
        {} as { [key: string]: number }
      );

      const churn_rate_by_plan = subscriptions.reduce(
        (acc, curr) => {
          if (curr.status === 'Cancelada') {
            if (!acc[curr.periodicity]) {
              acc[curr.periodicity] = 0;
            }

            acc[curr.periodicity] = (acc[curr.periodicity] || 0) + 1;
          }
          return acc;
        },
        {} as { [key: string]: number }
      );

      const analytics_raw = countSubscriptionStatuses(subscriptions);
      const analytics = {
        active_customers: analytics_raw.active,
        customers_chrun: analytics_raw.cancelled,
        trial_customers: analytics_raw.trial_active,
        retention_rate: (analytics_raw.active / analytics_raw.total) * 100,
        customers_churn_rate:
          (analytics_raw.cancelled / analytics_raw.total) * 100,
        avarage_mrr: avarageMMRSubscriptionsTotals(subscriptions),

        active_customers_by_plan: active_customers_by_plan,
        churn_rate_by_plan: churn_rate_by_plan,
      };

      res.status(200).json({ analytics, inport: findImport });
    } catch (e) {
      next(e);
    }
  }
}

export default AnalyticsController;
