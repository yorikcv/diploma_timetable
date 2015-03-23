'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    HttpError = require('./errors').HttpError;

var app = module.exports = exports.app = express();

app.locals.siteName = "Diploma";
// Connect to database
var db = require('./config/db');
app.use(express.static(__dirname + '/public'));


// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + '/' + file);
});

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

if ('test' == env) {
    app.use(morgan('test'));
    app.set('view options', {
        pretty: true
    });
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}

if ('production' == env) {
    app.use(morgan());
    app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(methodOverride());
app.use(bodyParser());

// Bootstrap routes/api
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function(file) {
    require(routesPath + '/' + file)(app);
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
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

var mongoose = require('mongoose'),
    Subject = mongoose.models.Subject,
    Teacher = mongoose.models.Teacher;

// var subject = new Subject({name: "Пристрої звязку з обєктом"});

// subject.save(function(err) {
//     if (!err) {
//         console.log("created teacher");
//     } else {
//        console.log("created dont teacher");
//     }
// });

// Subject
//     .findOne({
//         _id: "550db072da0cddb8104c9946"
//     })
//     .populate('teachers')
//     .exec(function(err, subject) {
//         if (err) return handleError(err);
//         console.log(subject.teachers[0].name.first);
//     })



// Start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
