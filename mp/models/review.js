const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/reviewsdb';


const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const reviewSchema = new mongoose.Schema({
    username: { type: String, required: [true, "No username provided"] },
    body: { type: String, required: [true, "No body provided"] },
    rating: {type: Float32Array,required:[true, "No rating provided"]},
  }

);

module.exports = mongoose.model('reviews', reviewSchema);
