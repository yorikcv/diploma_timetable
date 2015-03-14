'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var teacherSchema = new Schema({
	name: { type: String },
	surname: { type: String },
	middleName: { type: String },
	active: { type: Boolean, default: true },
	created: { type: Date , default: Date.now }
});

module.exports = mongoose.model('Teacher', teacherSchema);