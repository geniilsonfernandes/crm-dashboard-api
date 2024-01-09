import { Response, type NextFunction, type Request } from 'express';
import SubscriptionsService from './subscriptions.service';

class SubscriptionsController {
  private readonly subscriptionsService = new SubscriptionsService();

  public import = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send({
          message: 'Please upload a file',
        });
      }

      const data = await this.subscriptionsService.import(file.path);

      res.send({ message: 'Subscriptions imported successfully', data: data });
    } catch (e) {
      next(e);
    }
  };
}

export default SubscriptionsController;
