var mongoose = require('mongoose'),
    User = mongoose.models.User;

module.exports = function(req, res, next) {

	console.log(req.session.user);
    if (!req.session.user) return next();

    User.findById(req.session.user, function(err, user) {

        if (err) return next(err);

        req.user = res.locals.user = user;
        next();
    });

};
