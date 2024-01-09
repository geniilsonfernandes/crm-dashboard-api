import { NextFunction, Request, Response } from 'express';

class SubscriptionsImportController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      next(e);
    }
  }
}

export default SubscriptionsImportController;
