import express from 'express';
import { port } from './config/env-validation';
import router from './http';
import ErrorHandler from './helpers/ErrorHandler';
import cors from 'cors';
const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(router);
app.use(ErrorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
