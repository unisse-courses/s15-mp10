const fs = require('fs');
const handlebars = require('handlebars');

const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');

function User(userID, email, username, password, bio, isStoreOwner) {
    this.userID = userID;
    this.email = email;
    this.username = username;
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

async function getMinMaxUserID(sortby, offset) {
    //sortby - min = 1, max = -1
    //offset - adds userad by offset
    var highestID = await userModel.aggregate([{
        '$sort': {
            'userID': sortby
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'userID': 1
        }
    }]);

    return highestID[0].userID + offset;
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

    postUserSignup: async function(req, res){
        var {
            email,
            username,
            pass
        } = req.body;

        try {
            var userID = await getMinMaxUserID(-1, 1);
            var user = new User(userID, email, username, pass, "", false);
            var newUser = new userModel(user);
            var result = await newUser.recordNewUser();
            if (result)
                res.send({
                    status: 200,
                    userID
                });
            else res.send({
                status: 401,
                msg: 'Cannot connect to database'
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 500,
                msg: e
            });
        }
    },
}

module.exports = indexFunctions;