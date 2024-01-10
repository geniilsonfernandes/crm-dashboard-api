import { Router } from 'express';

import upload from '../../middlewares/multerConfig';
import ImportController from './Import.controller';
import GetImportsController from './GetImports.controler';

const subscriptions: Router = Router();
const importController = new ImportController();
const getImportsController = new GetImportsController();

subscriptions.post('/import', upload.single('file'), importController.handle);
subscriptions.get('/imports', getImportsController.handle);

export default subscriptions;
