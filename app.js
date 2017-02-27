var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');

var salt = bcrypt.genSalt(10);
var passwordToSave = bcrypt.hash(passwordFromUser, salt);

var db = require('./public/javascripts/db.js');

db.connect('mongodb://localhost:27017/blog', function(err) {
  if (err) {
    console.log('Impossible de se connecter à la base de données.');
    process.exit(1);
  } else {
    app.listen(8080, function() {
      console.log('Le serveur est disponible sur le port 8080');
    });
  }
});

var index = require('./routes/index');
var users = require('./routes/users');



var app = express();

//MOTEUR DE TEMPLATE  (view engine setup)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MIDDLEWARE
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use(session({
  secret: 'a1z2e3r4t5y6u7i8o9',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

