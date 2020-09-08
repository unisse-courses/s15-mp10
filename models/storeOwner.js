const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/storeOwnersdb';


const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const storeOwnerSchema = new mongoose.Schema({
    username: { type: String, required: [true, "No username provided"] },
    password: { type: String, required: [true, "No password provided"] },
  }

);

module.exports = mongoose.model('storeOwners', storeOwnerSchema);