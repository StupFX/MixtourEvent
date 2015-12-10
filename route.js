/**
 * Created by adubois on 07/12/15.
 */
// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// custom library
// model
var Model = require('./model');

// index
var index = function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/accueil');
    } else {

        var user = req.user;

        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('index', {title: 'Home', user: user});
    }
};
//Accueil
//GET

var accueil = function(req, res, next) {
    //if(req.isAuthenticated()) res.redirect('/');
    res.render('index', {title: 'Accueil'});
};

// sign in
// GET
var signIn = function(req, res, next) {
    if(req.isAuthenticated()) res.redirect('/');
    res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {

    passport.authenticate('signin', { successRedirect: '/game',
        failureRedirect: '/login-registration'}, function(err, user, info) {

        if(err) {

            return res.render('login-registration', {title: 'Sign In', errorMessage: err.message});
        }

        if(!user) {

            return res.render('login-registration', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function(err) {
            if(err) {

                return res.render('login-registration', {title: 'Sign In', errorMessage: err.message});
            } else {

                return res.redirect('/game');
            }
        });

    })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {title: 'Sign Up'});
    }
};

// sign up
// POST
var signUpPost = function(req, res, next) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new Model.User({username: user.username}).fetch();

    return usernamePromise.then(function(model) {
        if(model) {
            res.render('login-registration', {title: 'login-registration', errorMessage: 'username already exists'});
        } else {
            //****************************************************//
            // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
            //****************************************************//
            var password = user.password;
            var hash = bcrypt.hashSync(password);
            var mail = user.mail;
            var firstname = user.firstname;
            var lastname = user.lastname;
            var age = user.age;
            var address = user.address;
            var postcode = user.postcode;
            var city = user.city;
            var country = user.country;
            var signUpUser = new Model.User({username: user.username, password: hash, mail: mail, firstname: firstname, lastname: lastname, age: age, address: address, postcode: postcode, city: city, country: country});

            signUpUser.save().then(function(model) {
                // sign in the newly registered user
                signInPost(req, res, next);
            });
        }
    });
};

// sign out
var signOut = function(req, res, next) {
    if(!req.isAuthenticated()) {
        notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/');
    }
};

// 404 not found
var notFound404 = function(req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};

var login = function(req, res, next) {
    if(req.isAuthenticated()) {
        res.render('game', {title:'Mixtour Event - Jouer'});
    }else{
        res.render('login-registration', {title:'Mixtour Event - Connexion / Inscription'});
    }
};

var contact = function (req, res, next) {
        res.render('contact', {title: 'contact'});
};

var faq = function (req, res, next) {
    res.render('faq', {title: 'faq'});
};


var game = function (req, res, next) {
    if(req.isAuthenticated()) {
        res.render('game', {title:'Mixtour Event - Jouer'});
    }else{
        res.redirect('/');
    }
};
// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;

module.exports.accueil = accueil;

module.exports.login = login;

module.exports.contact = contact;

module.exports.faq = faq;


module.exports.game = game;

