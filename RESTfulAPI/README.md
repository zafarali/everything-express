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
Obviously our system should have node.js installed on it. We also need to install MongoDB on our machine. (Make sure you know how to fire it up, i.e. `mongod` on the terminal).  
In this example we aren't going to be worrying too much about our front-end HTML system. You may ask: 'How do we interact with the API then?' There is an application called POSTman which the blogpost reccomends. I used that and it's quite good.  

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
