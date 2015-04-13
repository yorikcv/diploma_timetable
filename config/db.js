'use strict';
var mongoose = require('mongoose');
var config = require('../config');

var mongooseConfig = config.get('mongoose');

var port = mongooseConfig.port,
    user = mongooseConfig.user,
    pw = mongooseConfig.pw,
    host = mongooseConfig.host,
    db = mongooseConfig.db;

port = (port.length > 0) ? ":" + port : '';
var login = (user.length > 0) ? user + ":" + pw + "@" : '';
var uristring = "mongodb://" + login + host + port + "/" + db;

// Connect to Database

mongoose.connect(uristring, config.get('mongoose:options'), function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
        // return next(err);
    } else {
        console.log('Successfully connected to: ' + uristring);
    }
});

exports.mongoose = mongoose;
