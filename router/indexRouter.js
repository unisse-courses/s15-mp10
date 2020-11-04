const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');
// GETS
router.get('/', controller.getHomepage);
router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/storeSignup/:userID', controller.getStoreSignup)
router.get('/profile', controller.getProfile);
// ACTIONS
// POSTS
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/userSignup', indexMiddleware.validateSignup, controller.postUserSignup);
router.post('/storeSignup_user', indexMiddleware.validateSignup, controller.postUserSignup);
router.post('/storeSignup_store', controller.postStoreSignup)
module.exports = router;