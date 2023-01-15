import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
});
