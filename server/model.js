const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//UserVocabularySchema
const UserVocabularySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  correctGuesses: {
    type: Number,
    required: true
  }
})

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
  },
  currentVocabulary: [UserVocabularySchema],
  reviewVocabulary: {
    type: Array,
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
