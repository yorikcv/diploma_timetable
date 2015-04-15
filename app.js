'use strict';

// Module dependencies.
var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    fs = require('fs'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorhandler = require('errorhandler'),
    HttpError = require('./errors').HttpError;

var config = require('./config');

var app = module.exports = exports.app = express();

app.locals.siteName = "Diploma";
// Connect to database
var db = require('./config/db');
app.use(express.static(__dirname + '/public'));


var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    app.use(morgan('dev'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
}

if ('production' == env) {
    app.use(morgan());
    app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}

var MongoStore = require('connect-mongo')(session);
var sessionOptions = config.get('session');

//middlaware
app.use(bodyParser());
app.use(favicon('public/img/favicon.ico'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    secret: sessionOptions.secret,
    key: sessionOptions.key,
    cookie: sessionOptions.cookie,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));



// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + '/' + file);
});

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

// Bootstrap routes/api
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function(file) {
    require(routesPath + '/' + file)(app);
});

// 404
app.get('*', function(req, res, next){
  next(new HttpError(404));
});

// Error catch, next()
app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorhandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});




// Start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
