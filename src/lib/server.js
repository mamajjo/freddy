import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import wordRouter from '../resources/words/word.router';
import { connect } from '../utils/db';
import { logger } from './logger';
import { env } from './env';

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
app.use('/words', wordRouter);

export const start = async () => {
  async function connectDB() {
    console.warn('sth');
    await connect();
  }

  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`REST API on http://localhost:${env.PORT}/api`);
    });
  } catch (e) {
    logger.error('could not start up');
  }
  return app;
};

// export const app = express()

// app.disable('x-powered-by')

// app.use(cors())
// app.use(json())
// app.use(urlencoded({ extended: true }))
// app.use(morgan('dev'))

// app.post('/signup', signup)
// app.post('/signin', signin)

// app.use('/api', protect)
// app.use('/api/user', userRouter)
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

// export const start = async () => {
//   try {
//     await connect()
//     app.listen(config.port, () => {
//       console.log(`REST API on http://localhost:${config.port}/api`)
//     })
//   } catch (e) {
//     console.error(e)
//   }
// }
