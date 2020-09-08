const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: String,
    author: String,
    content: String
});

module.exports = mongoose.model('comments', commentSchema);