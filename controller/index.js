const fs = require('fs');
const handlebars = require('handlebars');

const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const storeImageModel = require('../models/storeImagesdb');
const sentImageModel = require('../models/sentImagesdb');
const reviewsModel = require('../models/reviewsdb');
const reviewScoreModel = require('../models/reviewScoresdb');
const {
    isRegExp
} = require('util');
const {
    findOneAndUpdate
} = require('../models/usersdb');

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

function reviewScore(reviewID, userID, score) {
    this.reviewID = parseInt(reviewID);
    this.userID = parseInt(userID);
    this.score = parseInt(score);
}

function Comment(commentID, userID, author, reviewID, content) {
    this.commentID = commentID;
    this.userID = userID;
    this.author = author;
    this.reviewID = reviewID;
    this.content = content;
}

async function getScore(reviewID) {
    var score = await reviewsModel.aggregate([{
        '$match': {
            'reviewID': parseInt(reviewID)
        }
    }, {
        '$lookup': {
            'from': 'ReviewScores',
            'localField': 'reviewID',
            'foreignField': 'reviewID',
            'as': 'scoresDta'
        }
    }, {
        '$unwind': {
            'path': '$scoresDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$group': {
            '_id': '$reviewID',
            'scores': {
                '$push': '$scoresDta.score'
            }
        }
    }, {
        '$project': {
            'score': {
                '$sum': '$scores'
            }
        }
    }]);

    return score[0].score;
}

async function newestReviews_User(storeID, userID) {
    return await reviewModel.aggregate([{
        '$match': {
            'storeID': parseInt(storeID),
            '$or': [{
                'userID': {
                    '$ne': parseInt(userID)
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
    }, {
        '$sort': {
            'postDate': -1
        }
    }]);
}
async function newestReviews_Guest(storeID) {
    return await reviewModel.aggregate([{
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
    }, {
        '$sort': {
            'postDate': -1
        }
    }]);
}

async function oldestReviews_User(storeID, userID) {
    return await reviewModel.aggregate([{
        '$match': {
            'storeID': parseInt(storeID),
            '$or': [{
                'userID': {
                    '$ne': parseInt(userID)
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
    }, {
        '$sort': {
            'postDate': 1
        }
    }]);
}
async function oldestReviews_Guest(storeID) {
    return await reviewModel.aggregate([{
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
    }, {
        '$sort': {
            'postDate': 1
        }
    }]);
}

async function mostApprovedReviews_User(storeID, userID) {
    return await reviewModel.aggregate([{
        '$match': {
            'storeID': parseInt(storeID),
            '$or': [{
                'userID': {
                    '$ne': parseInt(userID)
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
    }, {
        '$sort': {
            'score': -1
        }
    }]);
}
async function mostApprovedReviews_Guest(storeID) {
    return await reviewModel.aggregate([{
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
    }, {
        '$sort': {
            'score': -1
        }
    }]);
}

async function leastApprovedReviews_User(storeID, userID) {
    return await reviewModel.aggregate([{
        '$match': {
            'storeID': parseInt(storeID),
            '$or': [{
                'userID': {
                    '$ne': parseInt(userID)
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
    }, {
        '$sort': {
            'score': 1
        }
    }]);
}
async function leastApprovedReviews_Guest(storeID) {
    return await reviewModel.aggregate([{
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
    }, {
        '$sort': {
            'score': 1
        }
    }]);
}

async function isOwner(storeID, userID) {
    var store = await storeModel.findOne({
        storeID: storeID
    });
    if (store.userID == userID) {
        return true;
    } else {
        return false;
    }
}

async function getMinMaxReviewID(sortby, offset) {
    try {
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
    } catch {
        return 3000;
    }
}

async function getMinMaxCommentID(sortby, offset) {
    try {
        //sortby - min = 1, max = -1
        //offset - adds userad by offset
        var ID = await commentModel.aggregate([{
            '$sort': {
                'commentID': sortby
            }
        }, {
            '$limit': 1
        }, {
            '$project': {
                'commentID': 1
            }
        }]);
        return ID[0].commentID + offset;
    } catch {
        return 4000;
    }
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
    try {
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
    } catch {
        return 1000;
    }
}
async function getMinMaxStoreID(sortby, offset) {
    try {
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
    } catch {
        return 2000;
    }
}

// function createActionUrl(url, actions) {
//     var finalUrl = url;

//     for (var i = 0; i < actions.length; i++) {
//         finalUrl = finalUrl + '/' + actions[i];
//     }
//     return finalUrl;
// }
const indexFunctions = {
    /*
     USER SETTINGS FUNCTIONS
     */
    postUserSettings_sortReview: function (req, res) {
        req.session.userSettings.sortReview = parseInt(req.params.option);
        res.send();
    },

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
            var store = await storeModel.findOne({
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
                    '$and': [{
                        'userID': parseInt(userID)
                    }, {
                        'deleted': false
                    }]
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
                storeID: store.storeID,
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
                    '$and': [{
                        'userID': parseInt(userID)
                    }, {
                        'deleted': false
                    }]
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
        try { //initialize settings if not found
            console.log(req.session.userSettings.sortReview);
        } catch {
            console.log('Required settings not found. Initializing settings.');
            req.session.userSettings = {
                sortReview: 1
            }
        }
        var storeID = req.params.storeID;
        var store = await storeModel.findOne({
            storeID: storeID
        });

        if (req.session.type) { // check if user is logged in
            switch (req.session.userSettings.sortReview) {
                case 1:
                    var reviews = await newestReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 2:
                    var reviews = await oldestReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 3:
                    var reviews = await mostApprovedReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 4:
                    var reviews = await leastApprovedReviews_User(storeID, req.session.logUser.userID);
                    break;
                default:
                    console.log('Something went wrong');
                    break;
            }
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

            var owner = await isOwner(storeID, req.session.logUser.userID);
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
                ownerID: store.userID,
                description: store.description,
                reviewed: reviewed,
                reviews: reviews,
                myReview: myReview[0],
                owner: owner,
            });
        } else {
            switch (req.session.userSettings.sortReview) {
                case 1:
                    var reviews = await newestReviews_Guest(storeID);
                    break;
                case 2:
                    var reviews = await oldestReviews_Guest(storeID);
                    break;
                case 3:
                    var reviews = await mostApprovedReviews_Guest(storeID);
                    break;
                case 4:
                    var reviews = await leastApprovedReviews_Guest(storeID);
                    break;
                default:
                    console.log('Something went wrong');
                    break;
            }
            res.render('store', {
                title: 'Store',
                guest: true,
                userID: store.userID,
                storeName: store.storeName,
                stars: store.stars,
                description: store.description,
                ownerID: store.userID,
                reviews: reviews,
            });
        }

    },
    getStoreProfile: async function (req, res) {
        try {
            try { //initialize settings if not found
                console.log(req.session.userSettings.sortReview);
            } catch {
                console.log('Required settings not found. Initializing settings.');
                req.session.userSettings = {
                    sortReview: 1
                }
            }
            var storeID = req.params.storeID;
            var store = await storeModel.findOne({
                storeID: storeID
            });
            switch (req.session.userSettings.sortReview) {
                case 1:
                    var reviews = await newestReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 2:
                    var reviews = await oldestReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 3:
                    var reviews = await mostApprovedReviews_User(storeID, req.session.logUser.userID);
                    break;
                case 4:
                    var reviews = await leastApprovedReviews_User(storeID, req.session.logUser.userID);
                    break;
                default:
                    console.log('Something went wrong');
                    break;
            }
            res.render('storeprofile', {
                name: req.session.logUser.username,
                ID: req.session.logUser.userID,
                title: store.storeName,
                storeID: store.storeID,
                storeName: store.storeName,
                stars: store.stars,
                description: store.description,

                reviews: reviews,
            });
        } catch {
            res.render('login', {
                title: 'Login'
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
        res.redirect("back");
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
            }, {
                content: content,
                storeRating: rating,
                postDate: editDate,
                edited: true,
            });

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
    postScoreUp: async function (req, res) {
        var reviewID = req.params.reviewID;
        var userID = req.session.logUser.userID;

        var match = await reviewScoreModel.aggregate([{
            '$match': {
                'userID': parseInt(userID),
                'reviewID': parseInt(reviewID)
            }
        }]);

        if (match[0] == null) { //create new document if not exist
            var score = new reviewScore(reviewID, userID, 1);
            var newScore = new reviewScoreModel(score);
            console.log(newScore);
            await newScore.recordScore();
        } else { // update score if exist
            await reviewScoreModel.findOneAndUpdate({
                userID: parseInt(userID),
                reviewID: parseInt(reviewID)
            }, {
                score: 1
            });
        }

        var updatedScore = await getScore(reviewID);
        await reviewModel.findOneAndUpdate({
            reviewID: reviewID
        }, {
            score: updatedScore
        });

        res.send();
    },
    postScoreDown: async function (req, res) {
        var reviewID = req.params.reviewID;
        var userID = req.session.logUser.userID;

        var match = await reviewScoreModel.aggregate([{
            '$match': {
                'userID': parseInt(userID),
                'reviewID': parseInt(reviewID)
            }
        }]);

        if (match[0] == null) { //create new document if not exist
            var score = new reviewScore(reviewID, userID, -1);
            var newScore = new reviewScoreModel(score);
            console.log(newScore);
            await newScore.recordScore();
        } else { // update score if exist
            await reviewScoreModel.findOneAndUpdate({
                userID: parseInt(userID),
                reviewID: parseInt(reviewID)
            }, {
                score: -1
            });
        }

        var updatedScore = await getScore(reviewID);
        await reviewModel.findOneAndUpdate({
            reviewID: reviewID
        }, {
            score: updatedScore
        });

        res.send();
    },

    postMyComment: async function (req, res) {
        var {
            reviewID,
            content
        } = req.body;
        var commentID = await getMinMaxCommentID(-1, 1);

        var comment = new Comment(commentID, req.session.logUser.userID, req.session.logUser.username, reviewID, content);
        var newComment = new commentModel(comment);
        console.log(newComment);
        await newComment.recordComment();

        res.send();
    },

    postStoreEdit: async function (req, res) {
        var {
            storeID,
            storeName,
            desc
        } = req.body;

        console.log('----------------');
        console.log('storeID: ' + storeID);
        console.log('storeName: ' + storeName);
        console.log('description: ' + desc);
        console.log('----------------');

        await storeModel.findOneAndUpdate({
            storeID: storeID
        }, {
            storeName: storeName,
            description: desc
        });

        res.send();
    },
}
module.exports = indexFunctions;