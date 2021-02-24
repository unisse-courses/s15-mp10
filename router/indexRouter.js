const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');
// GETS
router.get('/', controller.getHomepage);
router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/storeSignup', controller.getStoreSignup)
router.get('/store/:storeID', controller.getStore);
router.get('/profile/user/:userID', controller.getProfile);
// POSTS
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/userSignup', indexMiddleware.validateSignup, controller.postUserSignup);
router.post('/storeSignup_store', controller.postStoreSignup);
router.post('/userProf_edit', indexMiddleware.validateUserEdit, controller.postUserEdit);

router.post('/submitReview', controller.postMyReview);
router.post('/deleteReview', controller.postDeletedReview);
router.post('/editReview', controller.postEditedReview);
module.exports = router;