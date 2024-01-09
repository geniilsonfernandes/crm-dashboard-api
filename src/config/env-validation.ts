import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;

if (!port) {
  throw new Error('PORT must be defined');
}

export { port };
