const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');
const store = require('../middlewares/multer');
// GETS
router.get('/', controller.getHomepage);
router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/storeSignup', controller.getStoreSignup)
router.get('/store/:storeID', controller.getStore);
router.get('/profile/user/:userID', controller.getProfile);
router.get('/profile/store/:storeID', controller.getStoreProfile);
// POSTS
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/userSignup', indexMiddleware.validateSignup, controller.postUserSignup);
router.post('/storeSignup_store', controller.postStoreSignup);
router.post('/userProf_edit', indexMiddleware.validateUserEdit, controller.postUserEdit);
router.post('/storeProf_Edit', controller.postStoreEdit);

router.post('/submitReview', controller.postMyReview);
router.post('/deleteReview', controller.postDeletedReview);
router.post('/editReview', controller.postEditedReview);

router.post('/scoreUp/:reviewID',indexMiddleware.validateScoreUp, controller.postScoreUp);
router.post('/scoreDown/:reviewID',indexMiddleware.validateScoreDown, controller.postScoreDown);

router.post('/submitComment', controller.postMyComment);

router.post('/upload/:storeID', store.array('images', 1) , controller.postImage);
router.post('/delete', controller.postDeleteImage);

/*
    USER SETTINGS
*/
router.post('/userSettings/sortReview/:option', controller.postUserSettings_sortReview);
router.post('/userSettings/search/:search', controller.postUserSettings_searchStore);
router.post('/userSettings/filter/:filter', controller.postUserSettings_filterStore);

module.exports = router;