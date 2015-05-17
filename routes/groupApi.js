module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Speciality = mongoose.models.Speciality,
        api = {},
        checkAuth = require('../middleware/checkAuth'),
        async = require('async');

    api.groupsPage = function(req, res) {
        res.render('groups');
    };

    // ALL
    api.groups = function(req, res, next) {
        Speciality.find(function(err, specialities) {
            if (err) {
                next(err);
            } else {
                if (specialities === null) next(404);
                var groups = [];
                for (var i = 0; i < specialities.length; i++) {
                    [].push.apply(groups, specialities[i].groups);
                }

                res.json(groups);


            }
        });
    };

    // GET
    // api.group = function(req, res, next) {
    //     var id = req.params.id;
    //     Group.findOne({
    //         '_id': id
    //     }, function(err, group) {
    //         if (err) {
    //             next(err);
    //         } else {
    //             if (group === null) return next(404);
    //             res.json(200, {
    //                 group: group
    //             });
    //         }
    //     });
    // };

    // POST
    api.addGroup = function(req, res) {

        if (typeof req.body.title == 'undefined') {
            return res.status(500).json({
                message: 'group is undefined'
            });
        }

        var groupObject = {
            title: req.body.title,
            yearEntered: req.body.yearEntered,
            yearEnded: req.body.yearEnded,
            memberStudent: req.body.memberStudent,
            specialityId: req.body.specialityId
        }


        Speciality.findById(groupObject.specialityId, function(err, speciality) {
            if (!speciality) return next(500);

            speciality.groups.push(groupObject);
            var group = speciality.groups[speciality.groups.length - 1];
            console.log(group);

            speciality.save(function(err, specialitySave) {
                if (!err) {
                    console.log("added group to speciality");
                    return res.status(200).json(group.toJSON());
                } else {
                    return res.status(500).json(err);
                }
            });
        });



    };

    // PUT
    // api.editGroup = function(req, res) {
    //     var id = req.params.id;

    //     Group.findById(id, function(err, group) {

    //         if (typeof req.body.name != 'undefined') {
    //             group.name = req.body.name;
    //         }
    //         if (typeof req.body.studentCount != 'undefined') {
    //             group.studentCount = req.body.studentCount;
    //         }

    //         return group.save(function(err) {
    //             if (!err) {
    //                 console.log("updated group");
    //                 return res.status(200).json(group.toObject());
    //             } else {
    //                 return res.status(500).json(err);
    //             }
    //             return res.status(201).json(group);
    //         });
    //     });

    // };

    // DELETE
    api.deleteGroup = function(req, res) {
        var id = req.params.id;

        async.waterfall([
            function(callback) {
                Speciality.find(function(err, specialities) {
                    if (err) callback(err);
                    if (specialities === null) callback(404);

                    for (var i = 0; i < specialities.length; i++) {
                        var groupDoc = specialities[i].groups.id(id);
                        if (groupDoc) callback(null, specialities[i].id);
                    }
                });
            },
            function(specialityId, callback) {
                if (!specialityId) callback(404);

                Speciality.findById(specialityId, function(err, speciality) {
                    if (err) callback(err);

                    speciality.groups.id(id).remove();

                    speciality.save(function(err, specialitySave) {
                        if (!err) {
                            callback(err);
                        } else {
                            callback(null, speciality.toObject())
                        }
                    });
                });
            }
        ], function(err, speciality) {
            if (!err) {
                console.log("deleted group from speciality");
                return res.status(204).json(speciality);
            } else {
                return res.status(500).json(err);
            }
        });


        // Speciality.find(function(err, specialities) {
        //     if (err) next(err);

        //     if (specialities === null) next(404);

        //     specialities.groups.id(id).remove();

        //     specialities.save(function(err) {
        //         if (err) return next(err);
        //         return res.status(204);
        //     });

        // });
    };

    app.get('/groups', checkAuth, api.groupsPage);
    app.get('/api/groups', checkAuth, api.groups);
    // app.get('/api/group/:id', checkAuth, api.group);
    app.post('/api/group', checkAuth, api.addGroup);
    // app.put('/api/group/:id', checkAuth, api.editGroup);
    app.delete('/api/group/:id', checkAuth, api.deleteGroup);
};
