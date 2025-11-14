import path from 'path';
import { config } from 'dotenv';

const envPath = path.resolve(__dirname, '../../../../.env');
config({ path: envPath });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the root .env file');
}

export const env = {
  port: Number(process.env.PORT) || 4000,
};
