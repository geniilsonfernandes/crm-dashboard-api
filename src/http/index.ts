import { Router } from 'express';

import analytics from './controllers/analytics';
import imports from './controllers/imports';

const router: Router = Router();

// Imports routes
router.use(imports);

// Subscriptions routes
router.use('/analytics', analytics);

export default router;
