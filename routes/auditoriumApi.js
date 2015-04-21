module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Auditorium = mongoose.models.Auditorium,
        api = {},
        checkAuth = require('../middleware/checkAuth');

    api.auditoriumsPage = function(req, res) {
        res.render('auditoriums');
    };

    // ALL
    api.auditoriums = function(req, res, next) {
        Auditorium.find(function(err, auditoriums) {
            if (err) {
                next(err);
            } else {
                if (auditoriums === null) next(404);
                res.json(auditoriums);
            }
        });
    };

    // GET
    api.auditorium = function(req, res, next) {
        var id = req.params.id;
        Auditorium.findOne({
            '_id': id
        }, function(err, auditorium) {
            if (err) {
                next(err);
            } else {
                if (auditorium === null) return next(404);
                res.json(200, {
                    auditorium: auditorium
                });
            }
        });
    };

    // POST
    api.addAuditorium = function(req, res) {

        var auditorium;

        if (typeof req.body.name == 'undefined') {
            return res.status(500).json({
                message: 'auditorium is undefined'
            });
        }

        var auditorium = {
            name: req.body.name,
            studentCount: req.body.studentCount
        }

        auditorium = new Auditorium(auditorium);

        auditorium.save(function(err) {
            if (!err) {
                console.log("created auditorium");
                return res.status(201).json(auditorium.toObject());
            } else {
                return res.status(500).json(err);
            }
        });

    };

    // PUT
    api.editAuditorium = function(req, res) {
        var id = req.params.id;

        Auditorium.findById(id, function(err, auditorium) {

            if (typeof req.body.name != 'undefined') {
                auditorium.name = req.body.name;
            }
            if (typeof req.body.studentCount != 'undefined') {
                auditorium.studentCount = req.body.studentCount;
            }

            return auditorium.save(function(err) {
                if (!err) {
                    console.log("updated auditorium");
                    return res.status(200).json(auditorium.toObject());
                } else {
                    return res.status(500).json(err);
                }
                return res.status(201).json(auditorium);
            });
        });

    };

    // DELETE
    api.deleteAuditorium = function(req, res) {
        var id = req.params.id;
        Auditorium.findById(id, function(err, auditorium) {
            return auditorium.remove(function(err) {
                if (!err) {
                    return res.send(204);
                } else {
                    return res.json(500, err);
                }
            });
        });
    };

    app.get('/auditoriums', checkAuth, api.auditoriumsPage);
    app.get('/api/auditoriums', checkAuth, api.auditoriums);
    app.get('/api/auditorium/:id', checkAuth, api.auditorium);
    app.post('/api/auditorium', checkAuth, api.addAuditorium);
    app.put('/api/auditorium/:id', checkAuth, api.editAuditorium);
    app.delete('/api/auditorium/:id', checkAuth, api.deleteAuditorium);
};
