/*
* this file supports the definition of the user model in our back end
application
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

/* user schema created */
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

/** let's export the User schema as a model definition known as User */
const User = module.exports = mongoose.model('User', UserSchema);

/* this exported function allows to get user by its ID
*/
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

/* this exported function allows to get user by its preferred username
*/
module.exports.getUserByUserName = function(username, callback){
    // creates a query which will look for an object which property username has the value username
    const query = {username: username};
    //note an error procedure should be managed here in case of disconnection, when the request doesn't find anything...
    User.findOne(query, callback);
};

/* this function adds a new user
@param user - the new user to add
@param callback function which has an error status and the reference to the user
*/
module.exports.addUser = function(newUser , callback){
    // let's hash the password: see documentation for bcryptjs
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err) throw err; //brute force passing over of the error
            // replace password in newUser with the hashed version of it
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

/**this function provides a password check mechanism
 * it receives a user and a candidate password
 * @param hash
 * @param candidatePwd
 * @callback function
 */
module.exports.comparePassword= function(candidatePwd, hash, callback){
    //though this can be put directly in the route, it is safer (more structured also) to keep it encapsulated
    bcrypt.compare(candidatePwd,hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
};