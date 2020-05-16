/*
 we are here describing the expected behavior for all
 the users routes.
*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
//config object has properties for app
const config = require('../config/database');
/** import the definition of User */
const User = require('../models/user');

/*
routes are created and register
*/
/**
 * register a new user within the database
 */
router.post('/register', (req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        }
        else{
            res.json({success: true, msg: 'User registered'});
        }
    });
});

/**
 * authenticate the user to connect him to the back end
 * 
 */
router.post('/authenticate', (req, res, next) =>{
    //get username
    const username = req.body.username;
    //get (candidate) passport
    const password = req.body.password;
    // then let's try to get the user by its username
    User.getUserByUserName(username, (err , user )=>{
        // if there is an error, this one is passed over to the client
        //remark this is not ideal and shall be treated with a proper error management
        //TODO: treat errors properly
        if(err) throw err;
        if(!user){
            //it seems the requested user does not exist
            return res.json({success: false, msg: 'User does not exist'});
        }
        else{
            //if user exists in db, then the password is checked wrt what is stored
            User.comparePassword(password , user.password, (err , ismatch)=>{
                //TODO: treat errors properly
                if(err) throw err;
                //then depending on the result of the comparison jwtoken is generated... or not
                if(ismatch){
                    //Creation du token
                    // last parameter is bunch of option to be passed
                    let userT = user.toObject();
                    //remove the password from user data
                    delete userT.password;
                    //then generate the token from the userT object
                    const token = jwt.sign(userT, config.secret, { expiresIn: '1h' });
                    //TODO: test on whether userT could not be used instead of recreating user from scratch
                    res.json({
                        sucess:true,
                        token: 'JWT '+token,
                        // user is recreated from the information available in db, but we don't send the object from the db as it has the password in it
                        user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                }
                else{
                    //password is not valid
                    res.json({
                        sucess: false,
                        msg: 'Wrong password'
                    });
                }
            });
        }
    });// getUserByUsername
}); // end of post: /Autenthicate

/**
 * provides the detail on the users profile
 */
router.get('/profile', passport.authenticate('jwt', {session:false}),  (req, res, next)=>{
    // reference to user is within the request itself -burried into the jwt
    // TODO: need to understand why the passport is still in here
    res.json({user: req.user});
});

/**
 * next is to validate the jwt when receiving it
 */
router.get('/validate', (req, res, next)=>{
    res.send('VALIDATE');
});

module.exports = router;