const fs = require('fs');
const handlebars = require('handlebars');

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
}

module.exports = indexFunctions;