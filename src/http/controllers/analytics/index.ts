import { Router } from 'express';
import AnalyticsController, { analyticsSchema } from './analytics.controller';
import { zodValidate } from '../../../utils/zodValidate';
import AnalyticsMRRController from './analyticsMRR.controller';

const analytics = Router();

const analyticsController = new AnalyticsController();
const analyticsMRRController = new AnalyticsMRRController();

analytics.get(
  '/analytics',
  zodValidate(analyticsSchema),
  analyticsController.handle
);

analytics.get(
  '/analytics/mrr',
  zodValidate(analyticsSchema),
  analyticsMRRController.handle
);

export default analytics;
