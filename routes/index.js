module.exports = function(app) {
    var mongoose = require('mongoose'),
        Teacher = mongoose.models.Teacher,
        route = {};
    // index.html
    route.index = function(req, res) {

        Teacher.find(function(err, teachers) {
            if (err) {
                res.json(500, err);
            } else {
                console.log(teachers);
                res.render('index', {
                    locals: {
                        teachers: teachers
                    }
                });
            }
        });


    };

    app.get('/', route.index);
};
