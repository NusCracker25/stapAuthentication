/**
 * definition of packages to be used within the below file
 */
const express = require('express');
const cors = require('cors');
const jwt = require ('jsonwebtoken');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database')

/* refers to external file where actual routes for users management will be described */
const users = require('./routes/users');

/*
 * connection to the database itself.
 * settings for connection are read from a config file
 */
mongoose.connect(config.database);
//detection of connection
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database is done '+config.database);
});
//detection of potential error with database
mongoose.connection.on('error', (err)=>{
    console.log('Database error: '+err);
});
/*
 * creation of the server itself
 * the port to be used is 3000 (should be the one taken from a config file or environment variable - when using with docker)
 */
const app = express();
// port number
const port = 3000;
/**
 * adding middleware for the server
 */
/* Cors to allow for external domain usage */
app.use(cors());

/*
configuration of static folder from where resources will likely be served to end user
*/
app.use(express.static(path.join(__dirname, 'public')));

/* body-parser for spelling out content of request */
app.use(bodyParser.json());

/* add Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

/** definition of the strategy to be used */
require('./config/passport')(passport);
console.log('Policy for JWT is selected');

/** add the users/routes management in here */
app.use('/users', users);

/*
 creation of routes for doing something.
 the creation of routes follow the standard HTTP keyword for transaction
 */
app.get('/', (req,res)=>{
    res.send('Invalid end point');
})


//the server is now listening on the port passed in parameter
// upon event, the callback function is used (note the usage of arrow function here)
app.listen(port, ()=>{
    console.log('Server started on port '+port);
});