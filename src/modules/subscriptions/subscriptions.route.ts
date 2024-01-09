import { Router } from 'express';
import SubscriptionsController from './subscriptions.controller';
import upload from '../../middlewares/multerConfig';

const subscriptions: Router = Router();
const controller = new SubscriptionsController();

subscriptions.post('/import', upload.single('file'), controller.import);

export default subscriptions;
