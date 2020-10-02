import mongoose from 'mongoose';
import { env } from '../lib/env';

export function connect(url = env.DB_URL, opts = {}) {
  return mongoose.connect(env.DB_URL, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
}
