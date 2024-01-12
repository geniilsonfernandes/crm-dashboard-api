import express from 'express';
import { port } from './config/env-validation';
import router from './http';
import ErrorHandler from './helpers/ErrorHandler';
import cors from 'cors';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import { ExpressAdapter } from '@bull-board/express';

import importQueue from './queue/queue';

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/jobs');

createBullBoard({
  queues: [new BullAdapter(importQueue)],
  serverAdapter,
});

// ... express server configuration

app.use('/jobs', serverAdapter.getRouter());

app.use(router);
app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
