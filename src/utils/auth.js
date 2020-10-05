import { logger } from '../lib/logger';
import { Router } from 'express';
import { User } from '../resources/users/user.model';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.secret.jwt_secret, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
};

export const createToken = (user) => {
  return jwt.sign({ id: user._id }, env.secret.jwt_secret, {
    expiresIn: env.secret.JWT_LIFETIME
  });
};

const router = Router();

const signup = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.userName) {
      return res.status(400).json({ message: 'need username, email and password' });
    }
    const user = await User.find({ email: req.body.email }).lean().exec();
    if (user.length >= 1) {
      logger.info(`User ${req.body.email} already exists`);
      return res.status(409).json({ message: 'this email is taken' });
    }
    const newUser = await User.create({ ...req.body });
    newUser.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error });
  }
};

const signin = async (req, res) => {
  try {
    const invalid = { message: 'Invalid email and passoword combination' };

    if (!req.body.email || !req.body.password || !req.body.userName) {
      return res.status(400).json({ message: 'need username, email and password' });
    }
    try {
      const user = await User.findOne({
        userName: req.body.userName,
        email: req.body.email
      })
        .select('userName email password')
        .exec();
      const validPassword = await user.checkPassword(req.body.password);
      if (!validPassword) {
        return res.status(401).json({ data: invalid });
      }
      const userToken = createToken(user);
      res.status(200).json({
        data: {
          token: userToken,
          id: user._id
        }
      });
    } catch (error) {
      logger.debug(error);
      logger.error(`User ${req.body.userName} @${req.body.email} does not exists`);
      return res.status(409).json({ message: 'user does not exist' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error });
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (bearer === undefined) {
    return res.status(401).json({ message: 'You need to authenticate!' });
  }
  const token = bearer.split('Bearer ')[1].trim();

  let payload = null;
  try {
    payload = await verifyToken(token);
  } catch (error) {
    logger.error('Invalid token, error:', error);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id).select('-password').lean().exec();
  if (!user) {
    return res.status(401).end();
  }
  req.user = user;
  next();
};

router.post('/signup', signup);
router.get('/signin', signin);

export default router;
