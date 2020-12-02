const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');
const { isEmptyObject } = require('jquery');
const { default: validator } = require('validator');

const indexMiddleware = {
    validateSignup: async function (req, res, next) {
        var email = req.body.email;

        try{
            var match = await userModel.findOne({
                email: email
            });
            if (match) {
                res.send({
                    status: 400,
                    msg:'Email has already been used'
                });
            } else {
                return next();
            }
        }catch (e){
            res.send({
                status: 500,
                msg:'An error has occured'
            });
        }
    },

    validateUserEdit: async function(req, res, next){
        var username = req.body.username;
        var bio = req.body.bio;

        console.log(req.session);
        if(validator.isEmpty(username)){
            username = req.session.logUser.username;
            console.log('username was empty. Defaulted to: '+ username);
        }

        if(validator.isEmpty(bio)){
            bio = req.session.logUser.bio;
            console.log('bio was empty. Defaulted to: '+ bio);
        }

        return next();
    },
}

module.exports = indexMiddleware;