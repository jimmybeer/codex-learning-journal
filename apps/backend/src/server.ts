import { env } from './lib/env';
import cors from 'cors';
import express from 'express';
import entriesRouter from './routes/entries';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? '*',
  }),
);
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/entries', entriesRouter);

const port = env.port;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
