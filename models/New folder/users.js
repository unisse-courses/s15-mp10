const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    bio: String,
    isStoreOwner: Boolean
});

module.exports = mongoose.model('users', userSchema);