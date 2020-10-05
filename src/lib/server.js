import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import wordRouter from '../resources/words/word.router';
import { connect } from '../utils/db';
import authRouter, { protect } from '../utils/auth';
import { env } from './env';
import { logger } from './logger';
import userRouter from '../resources/users/user.router';

export const app = express();

const corsOptions = {
  orgin: 'http://localhost:3000'
};

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(morgan('dev'));
app.use('/api', protect);
app.use('/api/words', wordRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

export const start = async () => {
  async function connectDB() {
    await connect();
  }

  try {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.debug('Freddy API on http://localhost: ', { port: env.PORT });
    });
  } catch (e) {
    logger.error('could not start up');
  }
  return app;
};
