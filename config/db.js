'use strict';
var mongoose = require('mongoose');
var config = require('../config');

var port = config.get('mongoose:port'),
    user = config.get('mongoose:user'),
    pw = config.get('mongoose:pw'),
    host = config.get('mongoose:host'),
    db = config.get('mongoose:db');

port = (port.length > 0) ? ":" + port : '';
var login = (user.length > 0) ? user + ":" + pw + "@" : '';
var uristring = "mongodb://" + login + host + port + "/" + db;

// Connect to Database

mongoose.connect(uristring, config.get('mongoose:options'), function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Successfully connected to: ' + uristring);
    }
});

exports.mongoose = mongoose;
