const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/storesdb';


const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const storeSchema = new mongoose.Schema({
    storeName: { type: String, required: [true, "No store provided"] },
  }

);

module.exports = mongoose.model('stores', storeSchema);