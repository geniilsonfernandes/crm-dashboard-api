import { NextFunction, Request, Response } from 'express';

import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import dayjs from 'dayjs';
import countSubscriptionStatuses from '../../../utils/countSubscriptionStatuses';
// import dayjs from 'dayjs';

export const churnRateSchema = z.object({
  query: z.object({
    date_from: z.string({
      description: 'Date from must be a valid date',
    }),
    date_to: z.string({
      description: 'Date to must be a valid date',
    }),
  }),
});

class ChurnRateController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { date_from, date_to } = req.query as z.infer<
      typeof churnRateSchema
    >['query'];

    const intialDate = dayjs(date_from).toDate();
    const finalDate = dayjs(date_to).toDate();

    console.log({ intialDate, finalDate });

    try {
      const findImport = await prisma.imports.findFirst({
        where: {
          id: '0bb3b3a4-1c0b-40e1-9d45-c91ca4fcdfca',
        },
      });

      const subscriptions = await prisma.subscriptions.findMany({
        where: {
          import_id: '0bb3b3a4-1c0b-40e1-9d45-c91ca4fcdfca',
        },
      });

      const analytics = countSubscriptionStatuses(subscriptions);

      const churnRate = (analytics.cancelled / analytics.total) * 100;

      res
        .status(200)
        .json({ analytics, chrun_rate: churnRate, inport: findImport });
    } catch (e) {
      next(e);
    }
  }
}

export default ChurnRateController;
