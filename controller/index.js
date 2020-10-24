const fs = require('fs');
const handlebars = require('handlebars');

const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');

function User(userID, email, password, bio, isStoreOwner) {
    this.userID = userID;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.isStoreOwner = isStoreOwner;
}

function Store(storeID, userID, storeName, description) {
    this.storeID = storeID;
    this.userID = userID;
    this.storeName = storeName;
    this.description = description;
}

function Review(reviewID, userID, storeID, postDate, content, storeRating, score) {
    this.reviewID = reviewID;
    this.userID = userID;
    this.storeID = storeID;
    this.postDate = new Date(postDate);
    this.content = content;
    this.storeRating = storeRating;
    this.score = score;
}

function Comment(commentID, userID, reviewID, content) {
    this.commentID = commentID;
    this.userID = userID;
    this.reviewID = reviewID;
    this.content = content;
}
const indexFunctions = {
    getHomepage: function (req, res) {
        if (req.session.type) { // if req.session.type == true
            res.render('homepage', {
                title: 'ReviewMe',
                guest: false,
                user: req.session.logUser.username
            });
        } else { // if req.session.type == false
            res.render('homepage', {
                title: 'ReviewMe',
                guest: true
            });
        }
    },
    getLogin: function (req, res) {
        res.render('login', {
            title: 'Login'
        });
    },
    getSignup: function (req, res) {
        res.render('signup', {
            title: 'Sign Up'
        });
    },
    getStoreSignup: function (req, res) {
        res.render('storeSignup', {
            title: 'Sign Up'
        });
    },
    postLogin: async function (req, res) {
        var {
            email,
            pass
        } = req.body;
        try {
            var match = await userModel.findOne({
                email: email
            });
            if (match) {
                if (match.password == pass) {
                    if (match.isStoreOwner) {
                        req.session.logUser = match;
                        req.session.type = 'storeOwner';
                        console.log(req.session);
                        res.send({
                            status: 200
                        });
                    } else {
                        req.session.logUser = match;
                        req.session.type = 'regularUser';
                        console.log(req.session);
                        res.send({
                            status: 200
                        });
                    }
                } else {
                    res.send({
                        status: 400,
                        msg: 'Password does not match'
                    });
                }
            } else {
                res.send({
                    status: 400,
                    msg: 'No email found'
                });
            }
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    postLogout: function (req, res) {
        req.session.destroy();
        res.redirect("/");
    },

    postSignup: function(req, res){

    },
}

module.exports = indexFunctions;