module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Speciality = mongoose.models.Speciality,
        api = {},
        checkAuth = require('../middleware/checkAuth');

    api.specialitiesPage = function(req, res) {
        res.render('specialities');
    };

    // ALL
    api.specialities = function(req, res, next) {
        Speciality.find(function(err, specialities) {
            if (err) {
                next(err);
            } else {
                if (specialities === null) next(404);
                res.json(specialities);
            }
        });
    };

    // GET
    api.speciality = function(req, res, next) {
        var id = req.params.id;
        Speciality.findOne({
            '_id': id
        }, function(err, speciality) {
            if (err) {
                next(err);
            } else {
                if (speciality === null) return next(404);
                res.json(200, {
                    speciality: speciality
                });
            }
        });
    };

    // POST
    api.addSpeciality = function(req, res) {

        var speciality;

        if (typeof req.body.title == 'undefined') {
            return res.status(500).json({
                message: 'speciality is undefined'
            });
        }

        var speciality = {
            title: req.body.title,
            codeDepartment: req.body.codeDepartment
        }

        speciality = new Speciality(speciality);

        speciality.save(function(err) {
            if (!err) {
                console.log("created speciality");
                return res.status(201).json(speciality.toObject());
            } else {
                return res.status(500).json(err);
            }
        });

    };

    // PUT
    api.editSpeciality = function(req, res) {
        var id = req.params.id;

        Speciality.findById(id, function(err, speciality) {

            if (typeof req.body.name != 'undefined') {
                speciality.name = req.body.name;
            }
            if (typeof req.body.studentCount != 'undefined') {
                speciality.studentCount = req.body.studentCount;
            }

            return speciality.save(function(err) {
                if (!err) {
                    console.log("updated speciality");
                    return res.status(200).json(speciality.toObject());
                } else {
                    return res.status(500).json(err);
                }
                return res.status(201).json(speciality);
            });
        });

    };

    // DELETE
    api.deleteSpeciality = function(req, res) {
        var id = req.params.id;
        Speciality.findById(id, function(err, speciality) {
            return speciality.remove(function(err) {
                if (!err) {
                    return res.send(204);
                } else {
                    return res.json(500, err);
                }
            });
        });
    };

    app.get('/specialities', checkAuth, api.specialitiesPage);
    app.get('/api/specialities', checkAuth, api.specialities);
    app.get('/api/speciality/:id', checkAuth, api.speciality);
    app.post('/api/speciality', checkAuth, api.addSpeciality);
    app.put('/api/speciality/:id', checkAuth, api.editSpeciality);
    app.delete('/api/speciality/:id', checkAuth, api.deleteSpeciality);
};
