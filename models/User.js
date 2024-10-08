const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  status: {
    type: String,                 // je check si un compte est actif ou non lorsque je login
    enum: ['active', 'deleted'], // status peut avoir deux values active et deleted par defaut c'est active.
    default: 'active',
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
