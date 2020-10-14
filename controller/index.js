const fs = require('fs');
const handlebars = require('handlebars');

const indexFunctions = {
    getHomepage: function (req, res) {
        res.render('homepage', {
            title: 'ReviewMe'
        });
    },
}

module.exports = indexFunctions;