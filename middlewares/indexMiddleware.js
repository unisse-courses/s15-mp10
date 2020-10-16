const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const imageModel = require('../models/imagesdb');

const indexMiddleware = {
    validateSignup: async function (req, res, next) {
        var {
            email,
            pass,
            pass_repeat
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