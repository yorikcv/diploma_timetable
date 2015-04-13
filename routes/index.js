module.exports = function(app) {

    var mongoose = require('mongoose'),
        Teacher = mongoose.models.Teacher,
        route = {},
        checkAuth = require('../middleware/checkAuth');
    // index.html
    route.index = function(req, res) {

        Teacher.find(function(err, list, next) {
            if (err) {
                next(err);
            } else {
                console.log("teacher: " + list.length);
                res.render('index', {teachers: list});
            }
        });
    };

    app.get('/', checkAuth, route.index);
};
