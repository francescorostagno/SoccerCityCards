const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const breakRouter = require('./routes/break');

const config = require('./config');

const connection = mysql.createPool({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database,
  port: config.mysql.port ?? ''
})

global.db = connection;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new LocalStrategy(function verify(username,password,cb){
  db.query("SELECT * FROM users WHERE username = '" + username + "'", function (err,row){
    if(err){
      return cb(err);
    }
    if(row.length === 0){
      return cb(null, false, { message: 'Incorrect username or password.' });
    }else{
      const buffDb = Buffer.from(row[0].salt + password , 'utf-8');
      if(buffDb.toString('base64') !== row[0]['hashed_password']){
        return cb(null, false, { message: 'Incorrect username or password.' });
      }else {
        return cb(null, row[0]);
      }

    }

  })
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/break', breakRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
