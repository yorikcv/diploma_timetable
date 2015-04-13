module.exports = function(app) {
  // Module dependencies
  var mongoose = require('mongoose'),
      Teacher = mongoose.models.Teacher,
      api = {};

  // ALL
  api.teachers = function (req, res, next) {
    Teacher.find(function(err, teachers) {
      if (err) {
        next(err);
      } else {
        if (teachers === null) next(404);
        res.json({teachers: teachers});
      }
    });
  };

  // GET
  api.teacher = function (req, res, next) {
    var id = req.params.id;
    Teacher.findOne({ '_id': id }, function(err, teacher) {
      if (err) {
        next(err);
      } else {
        if (teacher === null) return next(404);
        res.json(200, {teacher: teacher});
      }
    });
  };

  // POST
  api.addTeacher = function (req, res) {

    var teacher;

    if(typeof req.body.teacher == 'undefined'){
      return res.json(500, {message: 'teacher is undefined'});
    }

    teacher = new Teacher(req.body.teacher);

    teacher.save(function (err) {
      if (!err) {
        console.log("created teacher");
        return res.json(201, teacher.toObject());
      } else {
         return res.json(500, err);
      }
    });

  };

  // PUT
  api.editTeacher = function (req, res) {
    var id = req.params.id;

    Teacher.findById(id, function (err, teacher) {

      if(typeof req.body.teacher.name.first != 'undefined'){
        teacher.name.first = req.body.teacher.name.first;
      }
      if(typeof req.body.teacher.name.last != 'undefined'){
        teacher.name.last = req.body.teacher.name.last;
      }
      if(typeof req.body.teacher.name.middle != 'undefined'){
        teacher.name.middle = req.body.teacher.name.middle;
      }

      return teacher.save(function (err) {
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
  api.deleteTeacher = function (req, res) {
    var id = req.params.id;
    Teacher.findById(id, function (err, teacher) {
      return teacher.remove(function (err) {
        if (!err) {
          console.log("removed teacher");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });
  };


  app.get('/api/teachers', api.teachers);
  app.get('/api/teacher/:id', api.teacher);
  app.post('/api/teacher', api.addTeacher);
  app.put('/api/teacher/:id', api.editTeacher);
  app.delete('/api/teacher/:id', api.deleteTeacher);
};