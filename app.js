var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var routes = require('./routes/index');
var users = require('./routes/users');
var Model = require('./model');
var route = require('./route');

var app = express();
//var app = require('express')();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



passport.use('signin',new LocalStrategy(function(username, password, done) {
  new Model.User({username: username}).fetch().then(function(data) {
    var user = data;
    if(user === null) {
      return done(null, false, {message: 'Invalid username or password'});
    } else {

      user = data.toJSON();
      if(!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: 'Invalid username or password'});
      } else {
            return done(null, user);
          }
        }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  new Model.User({username: username}).fetch().then(function(user) {
    done(null, user);
  });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'secret strategic xxzzz code'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/users', users);

// GET
app.get('/', route.index);

//Accueil
app.get('/accueil', route.accueil);

// signin
// GET
app.get('/signin', route.signIn);
// POST
app.post('/signin', route.signInPost);

// signup
// GET
app.get('/signup', route.signUp);
// POST
app.post('/signup', route.signUpPost);

//Contact
app.get('/contact',route.contact);

// faq

app.get('/faq',route.faq);

// logout
// GET
app.get('/signout', route.signOut);

app.get('/login-registration', route.login);

// game
// GET
app.get('/game', route.game);

app.get('/admin', route.admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


