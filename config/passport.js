/**
 * the files contains the JWT strategy of our choice.
 * 
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
    
    //options for the strategy
    let opts = {};
    //where the jwt is to be taken from in the request (here we take it from the AuthHeader, could be Bearer..)
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    //secret for encryption of information
    opts.secretOrKey = config.secret;
    //new strategy is then created and used by passport
    passport.use(new JwtStrategy(opts , (jwt_payload, done)=>{
        // get the user from the database
        User.getUserById(jwt_payload._id, (err, user)=>{
            //if we get an error.... 
            if(err){
                return done(err, false);
            }
            //if we actually get an user
            if(user){
                return done(null, user);
            }else{
                //no error during the request... but user was not found
                return done (null, false);
            }
        })
    }))
};