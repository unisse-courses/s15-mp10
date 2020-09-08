const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/usersdb';


const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "No username provided"] },
    password: { type: String, required: [true, "No password provided"] },
  }

);

module.exports = mongoose.model('users', userSchema);