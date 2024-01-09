import { Router } from 'express';
import SubscriptionsController from './subscriptions.controller';
import upload from '../../middlewares/multerConfig';

const subscriptions: Router = Router();
const subscriptionsController = new SubscriptionsController();

subscriptions.post(
  '/import',
  upload.single('file'),
  subscriptionsController.handle
);

export default subscriptions;
