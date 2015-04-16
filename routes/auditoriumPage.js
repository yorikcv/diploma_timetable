module.exports = function(app) {

    var mongoose = require('mongoose'),
        Auditorium = mongoose.models.Auditorium,
        route = {},
        checkAuth = require('../middleware/checkAuth');
    // index.html
    route.auditoriums = function(req, res) {

        Auditorium.find(function(err, list, next) {
            if (err) {
                next(err);
            } else {
                res.render('auditoriums', {auditoriums: list});
            }
        });
    };

    app.get('/auditoriums', checkAuth, route.auditoriums);
};
