const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { collection: 'vocabulary_mogul_users' });

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Create and export the User model
const User = mongoose.model('VocabularyMogulUser', UserSchema);

module.exports = User;
