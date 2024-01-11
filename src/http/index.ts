import { Router } from 'express';

import analytics from './controllers/analytics';
import imports from './controllers/imports';
import subscriptions from './controllers/subscriptions';

const router: Router = Router();

// Imports routes
router.use(imports);

// analytics routes
router.use(analytics);

//subscriptions
router.use(subscriptions);

export default router;
