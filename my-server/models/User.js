const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // ← 追加
  age: Number,
  gender: String,
  allergy: String,
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('User', userSchema);
