const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');
// GETS
router.get('/', controller.getHomepage);
router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/storeSignup', controller.getStoreSignup)
// ACTIONS
// POSTS
router.post('/login', controller.postLogin);
module.exports = router;