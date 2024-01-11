import { Router } from 'express';

import analytics from './controllers/analytics';
import imports from './controllers/imports';

const router: Router = Router();

// Imports routes
router.use(imports);

// analytics routes
router.use(analytics);

export default router;
