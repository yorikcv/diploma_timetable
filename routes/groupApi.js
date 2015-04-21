module.exports = function(app) {
    // Module dependencies
    var mongoose = require('mongoose'),
        Group = mongoose.models.Group,
        api = {},
        checkAuth = require('../middleware/checkAuth');

    api.groupsPage = function(req, res) {
        res.render('groups');
    };

    // ALL
    api.groups = function(req, res, next) {
        Group.find(function(err, groups) {
            if (err) {
                next(err);
            } else {
                if (groups === null) next(404);

                res.json(groups);
            }
        });
    };

    // GET
    api.group = function(req, res, next) {
        var id = req.params.id;
        Group.findOne({
            '_id': id
        }, function(err, group) {
            if (err) {
                next(err);
            } else {
                if (group === null) return next(404);
                res.json(200, {
                    group: group
                });
            }
        });
    };

    // POST
    api.addGroup = function(req, res) {

        var group;

        if (typeof req.body.title == 'undefined') {
            return res.status(500).json({
                message: 'group is undefined'
            });
        }

        var group = {
            title: req.body.title,
            yearEntered: req.body.yearEntered,
            yearEnded: req.body.yearEnded,
            memberStudent: req.body.memberStudent
        }

        group = new Group(group);

        group.save(function(err, groupSave) {
            if (!err) {
                console.log("created group");
                return res.status(201).json(groupSave);
            } else {
                return res.status(500).json(err);
            }
        });

    };

    // PUT
    api.editGroup = function(req, res) {
        var id = req.params.id;

        Group.findById(id, function(err, group) {

            if (typeof req.body.name != 'undefined') {
                group.name = req.body.name;
            }
            if (typeof req.body.studentCount != 'undefined') {
                group.studentCount = req.body.studentCount;
            }

            return group.save(function(err) {
                if (!err) {
                    console.log("updated group");
                    return res.status(200).json(group.toObject());
                } else {
                    return res.status(500).json(err);
                }
                return res.status(201).json(group);
            });
        });

    };

    // DELETE
    api.deleteGroup = function(req, res) {
        var id = req.params.id;
        Group.findById(id, function(err, group) {
            return group.remove(function(err) {
                if (!err) {
                    return res.send(204);
                } else {
                    return res.json(500, err);
                }
            });
        });
    };

    app.get('/groups', checkAuth, api.groupsPage);
    app.get('/api/groups', checkAuth, api.groups);
    app.get('/api/group/:id', checkAuth, api.group);
    app.post('/api/group', checkAuth, api.addGroup);
    app.put('/api/group/:id', checkAuth, api.editGroup);
    app.delete('/api/group/:id', checkAuth, api.deleteGroup);
};
