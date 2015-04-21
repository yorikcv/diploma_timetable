'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var teacherSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true,
            set: capitalize
        },
        last: {
            type: String,
            required: true,
            set: capitalize
        },
        middle: {
            type: String,
            required: true,
            set: capitalize
        }
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

function capitalize(val) {
    if ('string' != typeof val) val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

module.exports = mongoose.model('Teacher', teacherSchema);
