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

//log the routes we call
app.use( function (request, response, next) {
	console.log(request.method + ': ' + request.url);
	next();
});

/* ROUTE DECLARATION
here we create a Router object that we can configure.*/
var router = express.Router();

//here we associate the call to '/' with the json response below.
router.get('/', function (request, response) {
	response.json({message:'Welcome to the API!'});
});

/* ROUTING /friends */
router.route('/friends')
			.post(function (request, response) {
				//create a new friend
				var friend = new Friend();

				//get data from the body
				friend.name = request.body.name;

				friend.save(function (error) {
					//error handling here
					if(error){
						response.json({
							success:false, 
							message:'Error occurred',
							error: error
						});
					}

					response.json({
						message:'Friend made!',
						success: true
					});

				});
			})
			.get(function (request, response) {
				//finds all friends and passes the data to the call back
				Friend.find(function (error, data) {
					//error handling here
					if(error){
						response.json({
							success:false,
							message:'Error occured',
							error:error
						});
					}
					//send the data back as JSON
					response.json(data);
				});
			});

//since we are going be using different parameters, lets give this a generic name
//of parameter
router.route('/friends/:parameter')
			.get(function (request, response) {
				Friend.findOne({
					'name': request.params.parameter
				}, function (error, data) {
					if(error){
						response.json({
							success: false,
							message: 'Error occured',
							error: error
						});
					}
					response.json(data);
				});
			})

/* ROUTE REGISTRATION
Here we tell express to prefix the routes defined using 'router'
with /api */
app.use('/api', router);


// SERVER START UP
app.listen(port);
console.log('Now listening on localhost:' + port);