'use strict';
var mongoose = require('mongoose');
var config = require('../config');

var port = (config.get('mongoose:port').length > 0) ? ":" + config.get('mongoose:port') : '';
var login = (config.get('mongoose:user').length > 0) ? config.get('mongoose:user') + ":" + config.get('mongoose:pw') + "@" : '';
var uristring = "mongodb://" + login + config.get('mongoose:host') + port + "/" + config.get('mongoose:db');

// Connect to Database
mongoose.connect(uristring, config.get('mongoose:options'), function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Successfully connected to: ' + uristring);
    }
});


exports.mongoose = mongoose;
