const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    _id: String,
    type: String,
    owner: String,
    data: Buffer
});

module.exports = mongoose.model('images', imageSchema);