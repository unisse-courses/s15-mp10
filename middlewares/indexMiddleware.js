const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const reviewScoreModel = require('../models/reviewScoresdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');
const {
    isEmptyObject
} = require('jquery');
const {
    default: validator
} = require('validator');
const reviewScoresModel = require('../models/reviewScoresdb');

const indexMiddleware = {
    validateSignup: async function (req, res, next) {
        var email = req.body.email;

        try {
            var match = await userModel.findOne({
                email: email
            });
            if (match) {
                res.send({
                    status: 400,
                    msg: 'Email has already been used'
                });
            } else {
                return next();
            }
        } catch (e) {
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },

    validateUserEdit: async function (req, res, next) {
        var username = req.body.username;
        var bio = req.body.bio;

        console.log(req.session);
        if (validator.isEmpty(username)) {
            username = req.session.logUser.username;
            console.log('username was empty. Defaulted to: ' + username);
        }

        if (validator.isEmpty(bio)) {
            bio = req.session.logUser.bio;
            console.log('bio was empty. Defaulted to: ' + bio);
        }

        return next();
    },
    validateScoreUp: async function (req, res, next) {
        var reviewID = req.params.reviewID;
        var userID = req.session.logUser.userID;

        var match = await reviewScoreModel.aggregate([{
            '$match': {
                'userID': parseInt(userID),
                'reviewID': parseInt(reviewID)
            }
        }]);

        // pass if score is -1 or null
        if (match[0] != null) {
            if (match[0].score == 1) {
                res.send({
                    status: 500,
                    msg: 'Review already given a positive score'
                });
            } else {
                return next();
            }
        } else {
            return next();
        }
    },
    validateScoreDown: async function (req, res, next) {
        var reviewID = req.params.reviewID;
        var userID = req.session.logUser.userID;

        var match = reviewScoreModel.aggregate([{
            '$match': {
                'userID': parseInt(userID),
                'reviewID': parseInt(reviewID)
            }
        }]);
        // pass if score is 1 or null
        if (match[0] != null) {
            if (match[0].score == -1) {
                res.send({
                    status: 500,
                    msg: 'Review already given a negative score'
                });
            } else {
                return next();
            }
        } else {
            return next();
        }
    },
}

module.exports = indexMiddleware;