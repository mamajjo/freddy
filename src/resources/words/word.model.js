import mongoose from 'mongoose';

const wordScheme = new mongoose.Schema({
  word: String,
  author: String,
  story: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: Date.now }
});

export const Word = mongoose.model('word', wordScheme);
