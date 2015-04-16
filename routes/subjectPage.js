module.exports = function(app) {

    var mongoose = require('mongoose'),
        Subject = mongoose.models.Subject,
        route = {},
        checkAuth = require('../middleware/checkAuth');
    
    route.subjects = function(req, res) {

        Subject.find(function(err, list, next) {
            if (err) {
                next(err);
            } else {
                res.render('subjects', {subjects: list});
            }
        });
    };

    app.get('/subjects', checkAuth, route.subjects);
};
