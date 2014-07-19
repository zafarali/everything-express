RESTful API Using Node.js and Express 4
====================================

Following tutorial at [scotch.io](http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4).  

## First Things First
The first thing that we need to get out of the way to start developing our API is install our dependencies, we define all of these in `package.json` and after this we can do a one command install it. Run `npm install` on the command line and npm (node package manager) will install all of these into a folder node_modules in your folder.  
You may ask what we are installing so here is the low down:  
- `body-parser` has the most interesting name and I didn't know for a long time what it did. Turns out `body-parser` is responsible for handling content sent with POST requests.
- `express` is the framework we use to build our server. Express 4 which we have defined here has no more middlewear bundled with it so its more lightweight and simpler to use.
- `mongoose` is what we will use to communicate with the MongoDB database.  
So go ahead and `npm install` the above so we can started with the API.

### Wait... What else do we need?
Obviously our system should have node.js installed on it. We also need to install MongoDB on our machine. (Make sure you know how to fire it up, i.e. `mongod` on the terminal).  
In this example we aren't going to be worrying too much about our front-end HTML system. You may ask: 'How do we interact with the API then?' There is an application called POSTman which the blogpost reccomends. I used that and it's quite good.  

## server.js
Notice how in `package.json` we specified the main to be `server.js`. This means that we have declared that our application can be started up via `server.js`, naturally this is where we should get started!