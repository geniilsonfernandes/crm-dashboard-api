import { Router } from 'express';
import ImportController from './import.controller';
import upload from '../../middlewares/multerConfig';

const subscriptions: Router = Router();
const importController = new ImportController();

subscriptions.post('/import', upload.single('file'), importController.handle);

export default subscriptions;
