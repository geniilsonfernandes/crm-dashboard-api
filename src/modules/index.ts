import { Router } from 'express';

import subscriptions from './subscriptions/subscriptions.route';

const router: Router = Router();

router.use('/subscriptions', subscriptions);

export default router;
