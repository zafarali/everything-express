//using 'require' we define the packages we need
var express = require('express'),
		app	= express(), //we create a new express app.
		bodyParser = require('body-parser');


/* DATABASE CONNECTION */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
var Friend = require('./app/models/FriendSchema');

//here we tell our express app to use bodyParser as a middleware
app.use(bodyParser());

//here we get from the environment the PORT to use, or else default to 8080
var port = process.env.PORT || 8080;


/* ROUTE DECLARATION
here we create a Router object that we can configure.*/
var router = express.Router();

//here we associate the call to '/' with the json response below.
router.get('/', function (request, response) {
	response.json({message:'Welcome to the API!'});
});



/* ROUTE REGISTRATION
Here we tell express to prefix the routes defined using 'router'
with /api */
app.use('/api', router);


// SERVER START UP
app.listen(port);
console.log('Now listening on localhost:' + port);