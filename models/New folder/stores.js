const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    _id: String,
    name: String,
    owner: String,
    description: String,
    information: String
});

module.exports = mongoose.model('stores', storeSchema);