var mongoose = require('mongoose'),
    User = mongoose.models.User;

module.exports = function(req, res, next) {

	res.locals.user = null;

    if (!req.session.user) return next();

    User.findById(req.session.user, function(err, user) {

        if (err) return next(err);

        req.user = res.locals.user = user;
        next();
    });

};
