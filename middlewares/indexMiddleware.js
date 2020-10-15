const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const imageModel = require('../models/imagesdb');

const indexMiddleware = {
    validateLogin: async function (req, res, next) {
        var {
            email,
            pass
        } = req.body;
        if (false) {
            res.send();
        } else if (false) {
            res.sende();
        } else {
            res.next();
        }


    },

    validateSignup: async function (req, res, next) {
        var {email, pass, pass_repeat} = req.body;
    },
}

module.exports = indexMiddleware;