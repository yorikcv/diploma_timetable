'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var auditoriumSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    studentCount: {
        type: Number,
        required: true,
        min: 1,
        max: 100
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

module.exports = mongoose.model('Auditorium', auditoriumSchema);
