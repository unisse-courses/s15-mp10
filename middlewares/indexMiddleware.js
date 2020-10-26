const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');

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
}

module.exports = indexMiddleware;