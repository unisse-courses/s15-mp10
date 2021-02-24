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
    isRegExp
} = require('util');

function User(userID, email, username, password, bio, isStoreOwner) {
    this.userID = userID;
    this.email = email;
    this.username = username;
    this.password = password;
    this.bio = bio;
    this.isStoreOwner = isStoreOwner;
}

function Store(storeID, userID, storeName, description, stars) {
    this.storeID = storeID;
    this.userID = userID;
    this.storeName = storeName;
    this.description = description;
    this.stars = stars;
}

function Review(reviewID, userID, storeID, postDate, content, storeRating, score, edited, deleted) {
    this.reviewID = parseInt(reviewID);
    this.userID = parseInt(userID);
    this.storeID = parseInt(storeID);
    this.postDate = new Date(postDate);
    this.content = content;
    this.storeRating = parseInt(storeRating);
    this.score = parseInt(score);
    this.edited = edited;
    this.deleted = deleted;
}

function Comment(commentID, userID, reviewID, content) {
    this.commentID = commentID;
    this.userID = userID;
    this.reviewID = reviewID;
    this.content = content;
}

async function getMinMaxReviewID(sortby, offset) {
    //sortby - min = 1, max = -1
    //offset - adds userad by offset
    var ID = await reviewModel.aggregate([{
        '$sort': {
            'reviewID': sortby
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'reviewID': 1
        }
    }]);
    return ID[0].reviewID + offset;
}

async function getUpdatedRating(storeID) {
    var average = await reviewModel.aggregate([{
        '$match': {
            'storeID': parseInt(storeID),
            'deleted': false
        }
    }, {
        '$group': {
            '_id': '$storeID',
            'average': {
                '$push': '$storeRating'
            }
        }
    }, {
        '$project': {
            'average': {
                '$avg': '$average'
            }
        }
    }]);
    if (average[0])
        return parseInt(average[0].average);
    else
        return 0;
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
        if (req.session.type) { //check if user is logged in
            res.render('homepage', {
                title: 'ReviewMe',
                guest: false,
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                stores: JSON.parse(JSON.stringify(matches)),
            });
        } else {
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


            var accOwner = false;
            if (userID == req.session.logUser.userID)
                accOwner = true;

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
                accOwner: accOwner,
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
        if (req.session.type) { // check if user is logged in
            var reviews = await reviewModel.aggregate([{
                '$match': {
                    'storeID': parseInt(storeID),
                    '$or': [{
                        'userID': {
                            '$ne': req.session.logUser.userID
                        }
                    }, {
                        'deleted': true
                    }]
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
                    'preserveNullAndEmptyArrays': true
                }
            }]);
            var myReview = await reviewModel.aggregate([{
                '$match': {
                    'storeID': parseInt(storeID),
                    'userID': req.session.logUser.userID,
                    'deleted': false
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
                    'preserveNullAndEmptyArrays': true
                }
            }]);
            var reviewed = false;
            if (myReview[0])
                reviewed = true;
            res.render('store', {
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                title: store.storeName,
                guest: false,
                user: req.session.logUser.username,
                userID: req.session.logUser.userID,
                storeOwner: req.session.logUser.isStoreOwner,
                storeName: store.storeName,
                stars: store.stars,
                storeID: storeID,
                description: store.description,
                reviewed: reviewed,
                reviews: reviews,
                myReview: myReview[0],
            });
        } else {
            var reviews = await reviewModel.aggregate([{
                '$match': {
                    'storeID': parseInt(storeID),
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
                    'preserveNullAndEmptyArrays': true
                }
            }]);
            res.render('store', {
                title: 'Store',
                guest: true,
                userID: store.userID,
                storeName: store.storeName,
                stars: store.stars,
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
            var store = new Store(storeID, userID, storeName, storeDesc, 0);
            var newStore = new storeModel(store);
            var result = await newStore.recordStore();
            // console.log('postStoreSignup result:');
            // console.log(result);
            if (result) {
                await userModel.findOneAndUpdate({
                    userID: userID
                }, {
                    isStoreOwner: true
                });
                req.session.logUser.isStoreOwner = true;
                req.session.type = 'storeOwner';
                res.send({
                    status: 200
                });
            }
        } catch (e) {
            res.send({
                status: 500
            });
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

    postMyReview: async function (req, res) {
        try {
            var reviewID = await getMinMaxReviewID(-1, 1);
            var userID = req.session.logUser.userID;
            var {
                storeID,
                rating,
                content
            } = req.body;
            var postDate = new Date();

            var review = new Review(reviewID, userID, storeID, postDate, content, rating, 0, false, false);
            var newReview = new reviewModel(review);
            await newReview.recordReview();

            var stars = await getUpdatedRating(storeID);
            await storeModel.findOneAndUpdate({
                storeID: storeID
            }, {
                stars: stars
            });

            res.send({
                status: 200,
                msg: 'Review Submitted'
            });
        } catch {
            res.send({
                status: 500
            });
        }
    },
    postEditedReview: async function (req, res) {
        try {
            var {
                reviewID,
                storeID,
                rating,
                content
            } = req.body;
            var editDate = new Date();

            await reviewModel.findOneAndUpdate({
                reviewID: reviewID
            }
            // ,
            //  {
            //     content: content,
            //     storeRating: rating,
            //     postDate: editDate,
            //     edited: true,
                
                
            // }
            ,
            [{$push:{testing:'aaaaaaaaaaaaaa'}}]
            );

            var stars = await getUpdatedRating(storeID);
            await storeModel.findOneAndUpdate({
                storeID: storeID
            }, {
                stars: stars
            });

            res.send({
                status: 200,
                msg: 'Review Edited'
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 500
            });
        }
    },
    postDeletedReview: async function (req, res) {
        try {
            var {
                reviewID,
                storeID
            } = req.body;

            await reviewModel.findOneAndUpdate({
                reviewID: reviewID
            }, {
                content: '[DELETED]',
                deleted: true
            });

            var stars = await getUpdatedRating(storeID);
            await storeModel.findOneAndUpdate({
                storeID: storeID
            }, {
                stars: stars
            });

            res.send({
                status: 200,
                msg: 'Review Deleted'
            });
        } catch {
            res.send({
                status: 500
            });
        }
    },
}
module.exports = indexFunctions;