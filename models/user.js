const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,  
    required: false
  },
  domain: {
    type: String, 
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
