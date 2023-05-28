require('dotenv').config({path: './.env'});
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connection');
const session=require('express-session') 
const nocache = require("nocache");
const bodyParser = require('body-parser');



 db.connect((err)=>{
   if(err)
   console.log("error:-"+err);
   else
     console.log("database connected");
 })

 var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');

var app = express();

//no cache
app.use(nocache());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session
app.use(session({ secret: 'key',resave:false,saveUninitialized:false, cookie: { maxAge: 6000000 } }));


///excpetion

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//end

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', usersRouter);

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
