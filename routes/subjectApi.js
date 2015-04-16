module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Subject = mongoose.models.Subject,
        api = {},
        checkAuth = require('../middleware/checkAuth');

    // ALL
    api.subjects = function(req, res, next) {
        Subject.find(function(err, subjects) {
            if (err) {
                return next(err);
            } else {
                if (subjects === null) next(404);
                res.json(subjects);
            }
        });
    };

    // GET
    api.subject = function(req, res, next) {
        var id = req.params.id;
        Subject.findOne({
            '_id': id
        }, function(err, subject) {
            if (err) {
                return next(err);
            } else {
                if (subject === null) return next(404);
                res.json(200, {
                    subject: subject
                });
            }
        });
    };

    // POST
    api.addSubject = function(req, res, next) {

        if (typeof req.body.name == 'undefined') {
            return res.status(500).json({
                message: 'subject is undefined'
            });
        }

        var subject = {
            name: req.body.name,
            teachers: req.body.teachers
        }

        subject = new Subject(subject);

        subject.save(function(err) {
            if (!err) {
                console.log("created subject");
                return res.status(201).json(subject.toObject());
            } else {
                return res.status(500).json(err);
            }
        });

    };

    // PUT
    api.editSubject = function(req, res, next) {
        var id = req.params.id;

        Subject.findById(id, function(err, subject) {

            if (typeof req.body.name != 'undefined') {
                subject.name = req.body.name;
            }
            if (typeof req.body.studentCount != 'undefined') {
                subject.studentCount = req.body.studentCount;
            }
            if (err) {
                return next(err);
            } else {
                return subject.save(function(err) {
                    if (!err) {
                        console.log("updated subject");
                        return res.status(200).json(subject.toObject());
                    } else {
                        return res.status(500).json(err);
                    }
                    return res.status(201).json(subject);
                });
            }
        });

    };

    // DELETE
    api.deleteSubject = function(req, res, next) {
        var id = req.params.id;
        Subject.findById(id, function(err, subject) {
            if (err) {
                return next(err);
            } else {
                if (subject === null) return next(404);
                subject.remove(function(err) {
                    if (!err) {
                        return res.status(204).json(subject);
                    } else {
                        return res.status(500).json(err);
                    }
                })
            }
        });
    };


    app.get('/api/subjects', checkAuth, api.subjects);
    app.get('/api/subject/:id', checkAuth, api.subject);
    app.post('/api/subject', checkAuth, api.addSubject);
    app.put('/api/subject/:id', checkAuth, api.editSubject);
    app.delete('/api/subject/:id', checkAuth, api.deleteSubject);
};
