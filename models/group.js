'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    studentsCount: {
        type: Number,
        required: true
    },
    Subjects: [{
        type: ObjectId,
        ref: 'Subject'
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

module.exports = mongoose.model('Group', groupSchema);
