import express from 'express';
import { port } from './config/env-validation';
import router from './modules';

const app = express();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
