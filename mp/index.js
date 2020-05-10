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

// Students route
app.get('/students', function(req, res) {
  /** == README == **
    This used to hold the mongodb connection and find.
    But now, using only the model, we use the same find parameter.
    Using the query helper sort() so we also have the exec() function
    to be able to actually execute the query.
  **/
  studentModel.find({}).sort({ name: 1 }).exec(function(err, result) {
    // Handlebars fix!
    // Because of this error warning:
    // https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
    // we need to convert each object returned from the find to a plain JS object
    var studentObjects = [];

    result.forEach(function(doc) {
      studentObjects.push(doc.toObject());
    });
    // end handlebars fix!

    res.render('students', { title: 'Students', students: studentObjects });
    // try passing result for students instead of studentObjects to see the error!
  });
});

// Inserts a student in the database
app.post('/addStudent', function(req, res) {

  /** == README == **
    Instead of passing an object, we now have a mongoose.Document object
    because we created an instance of the studentModel.
  **/
  var student = new studentModel({
    name: req.body.name,
    id: req.body.id,
    img: `img/${req.body.gender}.png`
      // Potential error: there's no validation for gender on the client side
  });

  /** == README == **
    Directly calling save for the instance of the Document.
  **/
  student.save(function(err, student) {
    var result;

    /** == README == **
      Added error handling! Check out the object printed out in the console.
      (Try clicking Add Student when the name or id is blank)
    **/
    if (err) {
      console.log(err.errors);

      result = { success: false, message: "Student was not created!" }
      res.send(result);
      // throw err; // This is commented so that the server won't be killed.
    } else {
      console.log("Successfully added student!");
      console.log(student); // Check out the logs and see there's a new __v attribute!

      // Let's create a custom response that the student was created successfully
      result = { success: true, message: "Student created!" }

      // Sending the result as is to handle it the "AJAX-way".
      res.send(result);
    }

  });

});

// Finds the students matching the name query from the database and returns the array
app.post('/searchStudents', function(req, res) {
  /** == README == **
    This is still pretty similar to the mongodb way, using regex.
    We only have one condition here so it's not that efficient to do the chaining
  **/
  var pattern = "^" + req.body.name;

  studentModel.find({ name: { $regex: pattern } }, function(err, students) {
    console.log(students);
    res.send(students);
  });

});

/** == README == **
  Updated this to use findOneAndUpdate instead of mongoose's updateOne.
**/
app.post('/updateStudent', function(req, res) {
  var query = {
    name: req.body.name
  };

  var update = {
    $set: { id: '109' }
  };

  studentModel.findOneAndUpdate(query, update, { new: true }, function(err, user) {
    if (err) throw err;
    console.log(user);
    res.send(user);
  });

  /** == README == **
    You can switch this out with the other one to see the response of updateOne
  **/
  // studentModel.updateOne(query, update, function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   res.send(result);
  // });
});

/**
  To be able to render images, css and JavaScript files, it's best to host the static files
  and use the expected path in the data and the imports.

  This takes the contents of the public folder and makes it accessible through the URL.
  i.e. public/css/styles.css (in project) will be accessible through http://localhost:9090/css/styles.css
**/
app.use(express.static('public'));

// Listening to the port provided
app.listen(port, function() {
  console.log('App listening at port '  + port)
});
