import { Router } from 'express';

import subscriptions from './controllers/subscriptions';
import imports from './controllers/imports';

const router: Router = Router();

// Imports routes
router.use(imports);

// Subscriptions routes
router.use('/subscriptions', subscriptions);

export default router;
