RESTful API Using Node.js and Express 4
====================================

Following tutorial at [scotch.io](http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4).  

## First Things First
The first thing that we need to get out of the way to start developing our API is install our dependencies, we define all of these in `package.json` and after this we can do a one command install it. Run `npm install` on the command line and npm (node package manager) will install all of these into a folder node_modules in your folder.  
You may ask what we are installing so here is the low down:  
- `body-parser` has the most interesting name and I didn't know for a long time what it did. Turns out `body-parser` is responsible for handling content sent with POST requests.
- `express` is the framework we use to build our server. Express 4 which we have defined here has no more middleware bundled with it so its more lightweight and simpler to use.
- `mongoose` is what we will use to communicate with the MongoDB database.  
So go ahead and `npm install` the above so we can started with the API.

### Wait... What else do we need?
Obviously our system should have node.js installed on it. We also need to install [MongoDB](www.mongodb.org/) on our machine. (Make sure you know how to fire it up, i.e. `mongod` on the terminal). **alternative: we can use [mongolabs](https://mongolab.com) or [mongohq](https://www.mongohq.com/) to host a free sandbox server.  
In this example we aren't going to be worrying too much about our front-end HTML system. You may ask: 'How do we interact with the API then?' There is an application called [POSTman](http://www.getpostman.com/) which the blogpost reccomends. I used that and it's quite good.  

## server.js
Notice how in `package.json` we specified the main to be `server.js`. This means that we have declared that our application can be started up via `server.js`, naturally this is where we should get started!  
If you take a look at the file, we first start by using `require()` to get in all our requirements. We then use `app.use()` to tell Express to use the `body-parser` middleware.
### `app.use (optional-path, middleware-function)`
*Adapted from [Express 4.x API Documentation](http://expressjs.com/4x/api.html#app.use).*  
This is the standard way of telling express to use a middleware. Above `body-parser` is a middleware and we tell exrepss to use it. We can even make our own middlewares. A trivial example:
```javascript
app.use( function (request, response, next) {
	console.log(request.method + ': ' + request.url);
	next(); //this tells express that the middleware has completed it work and to move on.
});
```
The above logs the method and URL any time a request is made to the server. Here we haven't prefixed it to any path. If we do prefix it to a path, the middleware will only be used when the URL contains that path or else it will default to '/'.  
**WARN:** express middleware are defined sequentially. If you 'mount' middleware to '/something' all subsequent middlewares will only be invoked when the URL is prefixed with '/something'.
For example, if to the above we add the following:
```
app.use('/fun', function (request, response, next) {
	console.log( 'Someone is having fun' );
	next();
});
app.use('/fun', function (request, response, next) {
	console.log( 'I can only be invoked from /fun/\*!');
	next();
});
```
Our console output looks like this: 
```bash
GET: /
GET: /fun
I can only be invoked from /fun/*!
Someone is having fun!
GET: /fun/bam
I can only be invoked from /fun/*!
Someone is having fun!
```
As you can see we log our path and request type and then log in the functions we defined. If we swap the order as follows:
```javascript
app.use( '/fun', function(...){
	... 
	next();
});
app.use( function(...){
	//log the path
});
```
Our output looks as follows:
```bash
I can only be invoked from /fun/*!
Someone is having fun!
GET: /fun/bam
```
Thus you can see in `server.js`, we declared `bodyParser()` first because we would like to use it for all our URLs and is the *most* important. Your most important middleware go on at the top. At the bottom we defined a `rounter` and mounted that to `/api`. We also defined some basic routes to get started (more on this later).

### `app.listen(port)`
This mounts the express app to nodes inbuilt http server and will begin the app listening at the port given.

  
Load up the server using `node server.js` and navigate to localhost:port/api in your browser or send it a GET request from Postman. (Select the HTTP verb, type in the URL and click send. You should get a response!)

## MongoDB
### Accessing our MongoDB Database
If you have set up a MongoDB database as above, you need to copy the URI to be able to access the database. We use `mongoose` to interface between Node.js and the MongoDB. Add in your URI and `mongoose.connect()` and we are ready to go.  

### Schema
To be able to store and retrieve data, we need to define a Schema for our data. Let's go ahead and create a Schema in `app/models/FriendSchema.js`
As you can see in the following example, we first create a new Schema that will hold our data and the Data Type of each. For more data types we can refer to [mongoose documentation](http://mongoosejs.com/docs/guide.html).  
The last line exports the model and exposes it to Node.js. This emans that back in our `server.js` we can import the model using one line: `var Friend = require('./app/models/FriendSchema');`

### Wire it up!
If your using a local instance of MongoDB, run it on the terminal using `mongod` and you will see that the server is waiting and listening for new connections. `node server.js` our web app and you will see that MongoDB now registers a new connection (if all goes well!)

## API Design
Creating a good API first requires some planning. What would we like to do? What should we do? How should we design it? Since our aim here is to cover all the basic verbs here is what I've come up with:

Route | Verb | Function
---| --- | ---
/api/friends | `GET` | Retrieve a list of all Friends in the database
/api/friends | `POST` | Create a new Friend
/api/friends/:name | `GET` | Retrieve details of a Friend whos name is defined.
/api/friends/:id | `PUT` | Update a Friend with new details
/api/friends/:id | `DELETE` | Delete a Friend from our database

Thats a lot of stuff to design so lets get started with the coding part of it. **note: I have defined our own middleware for logging the route that was called**

### Making Friends
Let's first see how we can make a few friends so that we can list them using our API.
```javascript
router.route('/friends')
			.post(function (request, response) {
				//create a new friend
				var friend = new Friend();
				//we set its name to the name attached to the body sent to us.
				friend.name = request.body.name
				friend.save(callback);
			});
```
In the callback we handle if there was an error, if there wasn't we send a json response with message and success properties (see main server.js file). Load up POSTman, type in the URL, and select POST. set the key as name and the value as your best friends name. Click Send and we should see the response!

#### `request.body` and `request.param`
There are many ways to access data sent to us. `request.param(key)` allows us to get the data in any method (query, body or parameter)
```javascript
// QUERY
// ?name=JohnDoe
req.param('name')
// => "JohnDoe"

// BODY
// POST name=JohnDoe
req.param('name')
// => "JohnDoe"

// PARAMETER
// /user/JohnDoe for /user/:name 
req.param('name')
// "JohnDoe"
```
We can directly access either a query or the body using: `req.query.propertyName` and `req.body.propertyName` respectively. 

### Listing Friends
Listing friends is pretty simple as well, we call the `Friend.find()` and pass it a function that will handle the data callback. Refere to the server.js files to see how we do it.

### One Friend at a Time
Say we only wanted to get one friend? We could use `Friend.findById('long-id-here', callback)` and give it the ID that MongoDB assigns to every object, but assume we didn't know this and wanted to access by name. We could use `Friend.findOne({condition:requirement}, callback)` to handle it. This makes sense if we want to just access user data without the ID. We will use `findById` in a later example.
All we need to do is define an object which will be used to do the matching process: `{name: request.params.parameter}`. Look into the server.js file to see how it is done.

### Changing names
What if one of our friends changed their name? We want to change their name on the database as well right? Lets use the HTTP Verb `PUT` to update one of our friends. Here we define an 'id' just for 'security purposes' albeit this is not any safer than before but we can demonstrate another method for matching data to our database.  
Here we use `Friend.findById(mongodbidhere, callback)` to match and update a friend. Check out the code in server.js to see how its done, we return a matched friend, whos properties we update and then call the `save()` method on it.  
We can test it with POSTman, first do a GET to a friend using his/her name and copy his/her id. Now do the PUT call using that Id and don't forget to specify the values to update! You should see the response message as successful.

### Unfriending
Now lets look at the final part of our API, deleting a friend.  we use `Friend.remove()` and pass it a condition object: `{_id: condition }` that will be used to match the friend. When found it will be removed and we repond with a message.

## Conclusion
And there you have it, we have defined a 'CRUD' API which we have set up with minimal pain. A word of warning that this is just for tutorial/demo purposes. We would actually have to do a whole lot of checks to see if we have been authenticated or not and see if we have permssion to make delete/put requests etc.

#### Potential Pitfalls
##### Nothing appears under the 'name' property!
I noticed that with POSTman you have to send data as 'x-www-form-urlencoded' and not 'form-data', this might be the issue.
