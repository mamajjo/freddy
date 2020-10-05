import mongoose from 'mongoose';
import logger from '../../lib/logger';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = mongoose.model('user', userSchema);
