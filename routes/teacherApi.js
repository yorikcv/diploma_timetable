module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Teacher = mongoose.models.Teacher,
        api = {},
        checkAuth = require('../middleware/checkAuth');

    // ALL
    api.teachers = function(req, res, next) {
        Teacher.find(function(err, teachers) {
            if (err) {
                next(err);
            } else {
                if (teachers === null) next(404);
                res.json(teachers);
            }
        });
    };

    // GET
    api.teacher = function(req, res, next) {
        var id = req.params.id;
        Teacher.findOne({
            '_id': id
        }, function(err, teacher) {
            if (err) {
                next(err);
            } else {
                if (teacher === null) return next(404);
                res.json(200, {
                    teacher: teacher
                });
            }
        });
    };

    // POST
    api.addTeacher = function(req, res) {

        var teacher;

        if (typeof req.body.name == 'undefined') {
            return res.json(500, {
                message: 'teacher is undefined'
            });
        }

        var teacher = {
            name: req.body.name
        }

        teacher = new Teacher(teacher);

        teacher.save(function(err) {
            if (!err) {
                console.log("created teacher");
                return res.json(201, teacher.toObject());
            } else {
                return res.json(500, err);
            }
        });

    };

    // PUT
    api.editTeacher = function(req, res) {
        var id = req.params.id;

        Teacher.findById(id, function(err, teacher) {

            if (typeof req.body.name.first != 'undefined') {
                teacher.name.first = req.body.name.first;
            }
            if (typeof req.body.name.last != 'undefined') {
                teacher.name.last = req.body.name.last;
            }
            if (typeof req.body.name.middle != 'undefined') {
                teacher.name.middle = req.body.name.middle;
            }

            return teacher.save(function(err) {
                if (!err) {
                    console.log("updated teacher");
                    return res.json(200, teacher.toObject());
                } else {
                    return res.json(500, err);
                }
                return res.json(teacher);
            });
        });

    };

    // DELETE
    api.deleteTeacher = function(req, res) {
        var id = req.params.id;
        Teacher.findById(id, function(err, teacher) {
            return teacher.remove(function(err) {
                if (!err) {
                    return res.send(204);
                } else {
                    return res.json(500, err);
                }
            });
        });
    };


    app.get('/api/teachers', checkAuth, api.teachers);
    app.get('/api/teacher/:id', checkAuth, api.teacher);
    app.post('/api/teacher', checkAuth, api.addTeacher);
    app.put('/api/teacher/:id', checkAuth, api.editTeacher);
    app.delete('/api/teacher/:id', checkAuth, api.deleteTeacher);
};
