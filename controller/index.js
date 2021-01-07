const fs = require('fs');
const handlebars = require('handlebars');

const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');
const reviewsModel = require('../models/reviewsdb');
const {
    default: validator
} = require('validator');
const {
    findOne
} = require('../models/usersdb');

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

async function getMinMaxStoreID(sortby, offset) {
    //sortby - min = 1, max = -1
    //offset - adds userad by offset
    var highestID = await storeModel.aggregate([{
        '$sort': {
            'storeID': sortby
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'storeID': 1
        }
    }]);
    return highestID[0].storeID + offset;
}

// function createActionUrl(url, actions) {
//     var finalUrl = url;

//     for (var i = 0; i < actions.length; i++) {
//         finalUrl = finalUrl + '/' + actions[i];
//     }
//     return finalUrl;
// }
const indexFunctions = {
    getHomepage: async function (req, res) {
        /**DEBUG */
        // console.log('homepage: ');
        // console.log(req.session);

        var matches = await storeModel.find({});
        if (req.session.type) { // if req.session.type == true
            res.render('homepage', {
                title: 'ReviewMe',
                guest: false,
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                stores: JSON.parse(JSON.stringify(matches)),
            });
        } else { // if req.session.type == false
            res.render('homepage', {
                title: 'ReviewMe',
                guest: true,
                stores: JSON.parse(JSON.stringify(matches)),
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
    getStoreSignup: async function (req, res) {
        res.render('storeSignup', {
            title: 'Sign Up',
        });
    },
    getProfile: async function (req, res) {
        try {
            var userID = req.params.userID;
            var user = await userModel.findOne({
                userID: userID
            });
            var matches = await reviewsModel.aggregate([{
                '$lookup': {
                    'from': 'Stores',
                    'localField': 'storeID',
                    'foreignField': 'storeID',
                    'as': 'Store'
                }
            }, {
                '$match': {
                    'userID': parseInt(userID)
                }
            }, {
                '$unwind': {
                    'path': '$Store',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'postDate': 1,
                    'content': 1,
                    'storeRating': 1,
                    'score': 1,
                    'storeID': 1,
                    'storeName': '$Store.storeName',
                }
            }]);
            res.render('userProf', {
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                title: user.username,
                user: user.username,
                userID: user.userID,
                storeOwner: user.isStoreOwner,
                bio: user.bio,
                reviews: JSON.parse(JSON.stringify(matches))
            });
        } catch (e) {
            var userID = req.params.userID;
            var user = await userModel.findOne({
                userID: userID
            });
            var matches = await reviewsModel.aggregate([{
                '$lookup': {
                    'from': 'Stores',
                    'localField': 'storeID',
                    'foreignField': 'storeID',
                    'as': 'Store'
                }
            }, {
                '$match': {
                    'userID': parseInt(userID)
                }
            }, {
                '$unwind': {
                    'path': '$Store',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'postDate': 1,
                    'content': 1,
                    'storeRating': 1,
                    'score': 1,
                    'storeID': 1,
                    'storeName': '$Store.storeName',
                }
            }]);
            res.render('userProf', {
                guest: true,
                title: user.username,
                user: user.username,
                userID: user.userID,
                storeOwner: user.isStoreOwner,
                bio: user.bio,
                reviews: JSON.parse(JSON.stringify(matches))
            });
        }
    },
    getStore: async function (req, res) {
        var storeID = req.params.storeID;
        var store = await storeModel.findOne({
            storeID: storeID
        });
        var reviews = await reviewModel.aggregate([
            {
              '$match': {
                'storeID': 2002
              }
            }, {
              '$lookup': {
                'from': 'Comments', 
                'localField': 'reviewID', 
                'foreignField': 'reviewID', 
                'as': 'comments'
              }
            }, {
              '$lookup': {
                'from': 'Users', 
                'localField': 'userID', 
                'foreignField': 'userID', 
                'as': 'name'
              }
            }, {
              '$unwind': {
                'path': '$name', 
                'preserveNullAndEmptyArrays': false
              }
            }
          ]);
        console.log(store.storeName);
        if (req.session.type) { // if req.session.type == true
            res.render('store', {
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                title: store.storeName,
                guest: false,
                user: req.session.logUser.username,
                userID: req.session.logUser.userID,
                storeOwner: req.session.logUser.isStoreOwner,
                storeName: store.storeName,
                description: store.description,
                reviews: reviews,
            });
        } else { // if req.session.type == false
            res.render('store', {
                title: 'Store',
                guest: true,
                userID: store.userID,
                storeName: store.storeName,
                description: store.description,
                reviews: reviews,
            });
        }

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
                        res.send({
                            status: 200
                        });
                    } else {
                        req.session.logUser = match;
                        req.session.type = 'regularUser';
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
                msg: 'Something went wrong'
            });
        }
    },

    postLogout: function (req, res) {
        req.session.destroy();
        res.redirect("/");
    },

    postUserSignup: async function (req, res) {
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
            if (result) {
                req.session.logUser = newUser;
                req.session.type = 'regularUser';
                /**DEBUG */
                console.log(req.session);
                res.send({
                    status: 200,
                    userID
                });
            } else res.send({
                status: 401,
                msg: 'Cannot connect to database'
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },

    postStoreSignup: async function (req, res) {
        var {
            storeName,
            storeDesc
        } = req.body;
        var userID = req.session.logUser.userID;
        try {
            var storeID = await getMinMaxStoreID(-1, 1);
            var store = new Store(storeID, userID, storeName, storeDesc);
            var newStore = new storeModel(store);
            var result = await newStore.recordStore();
            if (result) {
                await userModel.findOneAndUpdate({
                    userID: userID
                }, {
                    isStoreOwner: true
                });
                req.session.logUser.isStoreOwner = true;
                req.session.type = 'storeOwner';
                res.send({
                    email: req.session.logUser.email,
                    pass: req.session.logUser.password
                });
            }
        } catch (e) {

        }

    },

    postUserEdit: async function (req, res) {
        var {
            username,
            bio
        } = req.body;
        var userID = req.session.logUser.userID;
        await userModel.findOneAndUpdate({
            userID: userID
        }, {
            username: username,
            bio: bio
        });
        req.session.logUser.username = username;
        req.session.logUser.bio = bio;
        res.send();
    },
}
module.exports = indexFunctions;