'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teachers: [{
        type: ObjectId,
        ref: 'Teacher'
    }],
    active: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
