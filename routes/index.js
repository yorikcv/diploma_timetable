module.exports = function(app) {
    var mongoose = require('mongoose'),
        Teacher = mongoose.models.Teacher,
        route = {};
    // index.html
    route.index = function(req, res) {

        Teacher.find(function(err, teachers) {
            if (err) {
                next(err);
            } else {
                res.render('index', {teachers: teachers});
            }
        });
    };

    app.get('/', route.index);
};
