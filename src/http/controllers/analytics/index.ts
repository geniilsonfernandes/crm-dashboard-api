import { Router } from 'express';
import AnalyticsController, { analyticsSchema } from './analytics.controller';
import { zodValidate } from '../../../utils/zodValidate';

const analytics = Router();

const analyticsController = new AnalyticsController();

analytics.get(
  '/analytics',
  zodValidate(analyticsSchema),
  analyticsController.handle
);

export default analytics;
