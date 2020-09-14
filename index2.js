const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');

const storeModel = require('./models/store');
const storeOwnerModel = require('./models/storeOwner');
const userModel = require('./models/user');

const app = express();
const port = 9090;

app.engine( 'hbs', exphbs({
  extname: 'hbs', 
  defaultView: 'homepage', 
  layoutsDir: path.join(__dirname, '/views/layouts'), 
  partialsDir: path.join(__dirname, '/views/partials'), 
}));

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** ROUTES **/
// Home route
app.get('/', function(req, res) {
  res.render('homepage', { title: 'Home' });
});

//image rendering
app.use(express.static('public'));

// Listening to the port provided
app.listen(port, function() {
  console.log('App listening at port '  + port)
});
