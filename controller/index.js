const fs = require('fs');
const handlebars = require('handlebars');

const userModel = require('../models/usersdb');
const storeModel = require('../models/storesdb');
const reviewModel = require('../models/reviewsdb');
const commentModel = require('../models/commentsdb');
const imageModel = require('../models/imagesdb');

const indexFunctions = {
    getHomepage: function (req, res) {
        if (req.session.type) { // if req.session.type == true
            console.log(req.session.type);
            res.render('homepage', {
                title: 'ReviewMe',
                user: req.session.userName
            });
        } else { // if req.session.type == false
            console.log(req.session.type);
            res.render('homepage', {
                title: 'ReviewMe',
                user: 'guest'
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
    postLogin: function (req, res) {
        console.log(req.body);
        var {
            email,
            pass
        } = req.body;
        res.send({
            status: 200
        });
    },
}

module.exports = indexFunctions;