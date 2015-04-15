module.exports = function(app) {

    // Module dependencies
    var mongoose = require('mongoose'),
        User = mongoose.models.User,
        api = {};
    var async = require('async');

    // ALL
    api.loginPage = function(req, res, next) {
        res.render('login');
    };

    api.auth = function(req, res, next) {
        var user = req.body.login,
            password = req.body.password;


        async.waterfall([
            function(callback) {
                User.findOne({login: user}, callback);
            },
            function(user, callback) {
                if (user) {
                    if (user.checkPassword(password)) {
                        callback(null, user);
                    } else {
                        next(401);
                    }
                } else {
                    next(401);
                }
            }
        ], function(err, user) {
            if (err) return next(err);
            req.session.user = user._id;
            res.sendStatus(200);
        });
    };

    api.logout = function(req, res, next) {
        req.session.destroy();
        res.sendStatus(200);
    };

    app.get('/login', api.loginPage);
    app.post('/login', api.auth);
    app.post('/logout', api.logout);
};
