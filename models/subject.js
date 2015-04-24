'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var subjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        set: capitalize
    },
    codeSubject: {
        type: Number,
        required: true
    },
    typeOfControl: {
        type: String,
        require: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    teacher: {
        type: ObjectId,
        ref: 'Teacher'
    },
    speciality: {
        type: ObjectId,
        ref: 'Speciality'
    },
    active: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

subjectSchema.path('typeOfControl').validate(function(typeOfControl) {
    return /exam|test/i.test(typeOfControl);
}, 'Type of control subject can be only Exam or Test');

function capitalize(val) {
    if ('string' != typeof val) val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

module.exports = mongoose.model('Subject', subjectSchema);
