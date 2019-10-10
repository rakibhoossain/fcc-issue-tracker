'use strict';

// Let's start by laying out our dependencies:
const express = require('express');
const bodyParser = require('body-parser');
// We'll be using Helmet.js to help secure out Express.js app:
const helmet = require("helmet");
// Finally, for tidiness' sake, we're keeping our API route handlers in a separate file/module, so let's make them accessible here to our server so that it can use them:
const apiRoutes = require('./routes/api.js');
// We'll need somewhere to store all the projects' various issues and run CRUD operations, for which we'll use a Mongo database:
const MongoClient = require('mongodb').MongoClient;



// With our dependencies sorted, we'll instantiate our Express.js server...
const app = express();
// ... and we'll tell it to use the bodyParser. This will parse incoming requests and make them easily available to us in req.body:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We'll also tell our Express app to use Helmet.js:
    // N.B. Helmet will by default load with these modules active: dnsPrefetchControl (control browser DNS prefetching), frameguard (prevent clickjacking), 
    // hidePoweredBy (remove X-Powered-By header), hsts (HTTP Strict Transport Security), ieNoOpen (X-Download-Options for IE8+), noSniff (stop clients from
    // sniffing MIME type), and xssFilter (small XSS protections).

    // For user story 1 we need the xssFilter module, which loads by default, so we don't have to do anything there.
    // In order to be able to embed this glitch project (e.g. in my portfolio), we'll need to disable the frameguard module, which loads by default:
app.use( helmet({
  frameguard: false
}));




// The freeCodeCamp test-suite needs the following...
const cors = require('cors');
app.use(cors({origin: '*'}));
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
// ... END of freeCodeCamp test suite dependencies.




// With our dependencies set up and our Express.js server instantiated, we'll now tell Express where we want to keep our static files (e.g. CSS, images, JS):
app.use('/public', express.static(process.cwd() + '/public'));

// Next, we'll tell Express what we want our homepage to be:
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// We'll also establish a page where the user can see all of the issues for any given project:
app.route("/:projectName")
  .get(function (req, res) {
    res.sendFile(process.cwd() + "/views/issue.html");
  });


// The rest of our routes will lead to CRUD actions in our Mongo DB database, so we'll fire up our connection to the database and place the remaining routes within it,
// as well as the app.listen(). We'll make sure to use the callback function to check for any errors and confirm that we are indeed properly connected before calling routes:
MongoClient.connect(
  process.env.MONGO_DB,
  function(err, db) {
    // We'll handle any errors that might arise from this remote/async event:
    if (err) return console.log("Error connecting to database:", err);
    
    // If there are no errors, we'll make sure that we're properly connected to the database using a robust test:
    ( db.serverConfig.isConnected() ) ? console.log("Successfully connected to Mongo database.") : console.log("Mongo DB is NOT CONNECTED!");
    
    // For tidiness' sake, we're keeping all of our route handlers in a separate file/module. Let's make them (and FCC's testing routes) available to our app here:
    
    // For FCC testing purposes...
    fccTestingRoutes(app);
    // ... END

    // Our routes:
    apiRoutes(app, db);
    
    // Finally, we'll set up our 404 page as our last route (so that it doesn't interfere with our other endpoint routes):
    app.use(function(req, res, next) {
      res.status(404)
        .sendFile(process.cwd() + "/views/404.html");
    });



    // With our server set up and our routes ready, all that's left to do is to make sure that our app is "alive" by having it listen for incoming requests:
    app.listen(process.env.PORT, function () {
      // We'll log the connection so that we can be sure that we're "live":
      console.log("Listening on port " + process.env.PORT);

      // For freeCodeCamp's testing purposes with Chai/Mocha:
          // N.B. By having NODE_ENV=test in our .env file, we will trigger the test suite.
      if(process.env.NODE_ENV==='test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          }
          catch(e) {
            let error = e;
            console.log('Tests are not valid:');
            console.log(error);
          }
        }, 3500);
      }  // ... END of freeCodeCamp's testing code.

    });  // END of app.listen()
    
    
  }  // END of MongoDB.connect() callback function
);  // END of MongoDB.connect()




// For freeCodeCamp's test suite...
module.exports = app;
// ... END freeCodeCamp test-suite requirements.