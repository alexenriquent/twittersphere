/** Required dependencies */
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var logger = require('morgan');
var routes = require('./routes/index');

/** Create an express object */
var app = express();

/** Use Morgan - Log requests to the terminal console */
app.use(logger('dev'));
/** Add connection to the public folder (client components) */
app.use(express.static(path.join(__dirname, '/../public')));
/** Add connection to the app folder (server components) */
app.use(express.static(path.join(__dirname, '/../app')));
/** Add connection to the main page */
app.use(express.static(__dirname + '/../public/views'));
/** Set EJS as a templating language with HTML as an extension */
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

/** Static route to the main page */
app.use('/', routes);

/** Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/** Export the module */
module.exports = app;