const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String, // URL address
    required: false,
  },
  watchList: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    required: false,
    default: [],
  },
  manager: {
    type: Boolean,  
    default: false, 
  },
});

module.exports = mongoose.model('User', User);
