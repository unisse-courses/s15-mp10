const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');

const indexMiddleware = {
    validateSignup: async function (req, res, next) {
        var {
            email,
            username,
            pass,
        } = req.body;

        if (false) {
            res.send();
        } else if (false) {
            res.send();
        } else {
            return next();
        }
    },
}

module.exports = indexMiddleware;