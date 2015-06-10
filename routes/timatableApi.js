module.exports = function(app) {
    var mongoose = require('mongoose'),
        moment = require('moment'),
        Auditorium = mongoose.models.Auditorium,
        Teacher = mongoose.models.Teacher,
        Subject = mongoose.models.Subject,
        Speciality = mongoose.models.Speciality,
        async = require('async'),
        _ = require('lodash'),
        api = {},
        checkAuth = require('../middleware/checkAuth');

    var startDate = moment("2015-05-25"),
        endDate = moment("2015-06-17");

    api.timetable = function(req, res, next) {

        async.parallel({
                specialities: function(callback) {
                    Speciality.find(callback);
                },
                auditoriums: function(callback) {
                    Auditorium.find(callback);
                },
                subjects: function(callback) {
                    Subject.find(callback);
                },
                teachers: function(callback) {
                    Teacher.find(callback);
                },
                datesWithoutWekends: function(callback) {
                    callback(null, createDatesArrayWekend(startDate, endDate));
                },
                datesWithWekends: function(callback) {
                    callback(null, createDatesArray(startDate, endDate));
                }
            },
            function(err, data) {
                if (err) res.send(err);
                var specialities = buildSpecialitiesWithSubjects(data.specialities, data.subjects),
                    timetable = createСhromosome(specialities, data.datesWithoutWekends, data.datesWithWekends, data.auditoriums, data.teachers);

                res.send(timetable);
            });


    }

    app.get('/timetable', checkAuth, api.timetable);

    function createDatesArrayWekend(startDate, endDate) {
        var dateArray = [],
            duration = moment.duration(endDate - startDate).asDays();

        for (var i = 0; i < (duration + 1); i++) {

            var day = moment(startDate);
            day.add('day', i);
            var dayOfWeek = day.day();

            if (!((dayOfWeek === 6) || (dayOfWeek === 0))) {
                dateArray.push(day);
            }
        };
        return dateArray;
    };

    function createDatesArray(startDate, endDate) {
        var dateArray = [],
            duration = moment.duration(endDate - startDate).asDays();

        for (var i = 0; i < (duration + 1); i++) {

            var day = moment(startDate);
            day.add('day', i);
            dateArray.push(day);
        };
        return dateArray;
    };


    function buildSpecialitiesWithSubjects(specialities, subjects) {
        specialities = JSON.parse(JSON.stringify(specialities));
        subjects = JSON.parse(JSON.stringify(subjects));
        var specislitiesNew = [];
        for (var i = 0; i < specialities.length; i++) {
            var groupNew = [];
            for (var j = 0; j < specialities[i].groups.length; j++) {
                var paramObject = {
                    semester: specialities[i].groups[j].semester,
                    speciality: specialities[i]._id,
                    property: specialities[i].groups[j].property
                }


                specialities[i].groups[j].subjects = _.filter(subjects, paramObject);
            };
        };
        return specialities;
    };


    function createСhromosome(specialities, datesWithoutWekends, datesWithWekends, auditoriums, teachers) {
        var chromosome = [],
            duration = durationDays(datesWithWekends[0], datesWithWekends[datesWithWekends.length - 1]),
            referenceDatesTeachers = createRefernceTable(datesWithWekends.length, teachers.length, 0),
            referenceDatesAuditoriums = createRefernceTable(datesWithWekends.length, auditoriums.length, 0),
            resetSpec = 0;


        for (var specCount = 0; specCount < specialities.length; specCount++) {
            resetSpec = 0;

            if (!chromosome.length) {
                specCount = 0;
            }
            var grpLength = specialities[specCount].groups.length;
            for (var grpCount = 0; grpCount < grpLength; grpCount++) {
                var group = specialities[specCount].groups[grpCount],
                    subjects = [],
                    subjectLength = group.subjects.length,
                    di = 1,
                    dmin = 1,
                    restartSubject = 0,
                    breakerTeach = 0,
                    referenceDatesTeachersSubj = clone(referenceDatesTeachers),
                    referenceDatesAuditoriumsSubj = clone(referenceDatesAuditoriums);

                for (var sbjCount = 0; sbjCount < subjectLength; sbjCount++) {
                    var subject = group.subjects[sbjCount],
                        dmax = duration - (subjectLength - sbjCount - 1) * 3;

                    //select DATE
                    restartSubject++;
                    if (sbjCount) {
                        dmin = di + 3;
                    }

                    var diRandom = getRandomInt(dmin, dmax + 1);
                    if (_.findIndex(datesWithoutWekends, datesWithWekends[diRandom - 1]) === -1) {
                        if (sbjCount) {
                            dmin = di - 3;
                        }
                        sbjCount--;
                    } else {
                        di = diRandom;

                        var auditoriumRandom,
                            restartAud = 0,
                            breakerAud = true,
                            restart = 0;
                        while (breakerAud) {
                            auditoriumRandom = getRandomInt(0, auditoriums.length);
                            if (referenceDatesAuditoriumsSubj[di - 1][auditoriumRandom] === 0) {
                                restartAud = 0;
                                referenceDatesAuditoriumsSubj[di - 1][auditoriumRandom] = 1;
                                breakerAud = false;
                            } else {
                                if (restartAud < auditoriums.length * 10) {
                                    auditoriumRandom = getRandomInt(0, auditoriums.length);
                                    restartAud++;
                                } else {
                                    breakerAud = false;
                                    restart = 1;
                                }

                            }
                        }

                        var teacher = _.indexOf(teachers, _.findWhere(teachers, {
                            id: subject.teacher
                        }));
                        breakerTeach = true;
                        if (!restartAud) {
                            while (breakerTeach) {

                                if (referenceDatesTeachersSubj[di - 1][teacher] === 0 ||
                                    referenceDatesTeachersSubj[di - 1][teacher] === 1) {
                                    referenceDatesTeachersSubj[di - 1][teacher]++;
                                    breakerTeach = false;
                                } else {
                                    breakerTeach = false;
                                    restart = 1;
                                }
                            }
                        }

                        var teacherName = teachers[teacher].name.first + " " + teachers[teacher].name.last + teachers[teacher].name.middle;

                        subjects.push({
                            speciality: specialities[specCount].title,
                            group: group.title,
                            subject: subject.title,
                            teacher: teacherName,
                            auditorium: auditoriums[auditoriumRandom].name,
                            shift: referenceDatesTeachersSubj[di - 1][teacher],
                            date: moment(datesWithWekends[di - 1]).format("dddd, MMMM Do YYYY")
                        });
                    }
                    //
                    if ((subjectLength * 2 === restartSubject) || (restart === 1)) {
                        sbjCount = subjectLength;
                        grpCount--;
                    }
                }


                //
                if (!(subjectLength * 2 === restartSubject) && !(restart === 1)) {
                    referenceDatesTeachers = clone(referenceDatesTeachersSubj);
                    referenceDatesAuditoriums = clone(referenceDatesAuditoriumsSubj);
                    chromosome = chromosome.concat(subjects);
                    console.log(chromosome.length);
                    console.log("Teacher = " + countArray(referenceDatesTeachers));
                    console.log("Auditorium = " + countArray(referenceDatesAuditoriums));
                } else {
                    resetSpec++;
                }

                if (resetSpec === specialities[specCount].groups.length * 10) {
                    chromosome = [];
                    duration = durationDays(datesWithWekends[0], datesWithWekends[datesWithWekends.length - 1]);
                    referenceDatesTeachers = createRefernceTable(datesWithWekends.length, teachers.length, 0);
                    referenceDatesAuditoriums = createRefernceTable(datesWithWekends.length, auditoriums.length, 0);
                    resetSpec = 0;

                    sbjCount = subjectLength;
                    grpCount = specialities[specCount].groups.length;
                    specCount = 0;

                }

            };
        };

        return {
            chromosome: chromosome,
            referenceDatesTeachers: referenceDatesTeachers,
            referenceDatesAuditoriums: referenceDatesAuditoriums
        };

    };

    function createRefernceTable(rows, cols, defaultValue) {

        var arr = [];
        // Creates all lines:
        for (var i = 0; i < rows; i++) {
            arr.push([]);
            arr[i].push(new Array(cols));
            for (var j = 0; j < cols; j++) {
                // Initializes:
                arr[i][j] = defaultValue;
            }
        }
        return arr;
    }

    function countArray(array) {
        var count = 0;
        // Creates all lines:
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                count = count + array[i][j];
            }
        }
        return count;
    }

    function durationDays(firstDate, secondDate) {
        var duration = moment.duration(moment(secondDate) - moment(firstDate)).asDays();
        return duration + 1;
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    function clone(arr) {
        return newArr = arr.map(function func(el) {
            if (Object.prototype.toString.call(el) == "[object Array]") {
                return el.map(func);
            }
            return el;
        });
    }
}
