import { Router } from 'express';
import ChurnRateController, { churnRateSchema } from './churn-rate.controller';
import { zodValidate } from '../../../utils/zodValidate';

const analytics = Router();

const churnRateController = new ChurnRateController();

analytics.get('/churn-rate', churnRateController.handle);

export default analytics;
