import { Router } from 'express';
import SubscriptionsController from './Subscriptions.controller';

const subscriptions: Router = Router();
const subscriptionsController = new SubscriptionsController();
subscriptions.get('/subscriptions', subscriptionsController.handle);

export default subscriptions;
