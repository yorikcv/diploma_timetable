var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    moment = require('moment');

require('../middleware/moment-fquarter');

var groupSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    yearEntered: {
        type: Date,
        required: true
    },
    yearEnded: {
        type: Date,
        required: true
    },
    memberStudent: {
        type: Number,
        require: true,
        min: 1,
        max: 100
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var specialitySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    codeDepartment: {
        type: Number,
        unique: true,
        required: true
    },
    groups: [groupSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

groupSchema.path('yearEntered').validate(function(yearEntered) {
    return yearEntered < this.yearEnded;
}, 'Year entered must be earlier than year ended');

groupSchema.path('yearEnded').validate(function(yearEnded) {
    return yearEnded > this.yearEntered;
}, 'Year ended must be later than year entered');


groupSchema.virtual('semester')
    .get(function() {
        var yearEntered = moment(this.yearEntered).year();
        var quarter = moment().fquarter(8);
        return (quarter.year - yearEntered) * 2 + quarter.quarter
    });

groupSchema.set('toJSON', {
   virtuals: true
});

// specialitySchema.methods.encryptPassword = function(password) {
//     return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
// };

// specialitySchema.virtual('password')
//     .get(function() {
//         return this._plainPassword;
//     });


// specialitySchema.methods.checkPassword = function(password) {
//     return this.encryptPassword(password) === this.hashedPassword;
// };

module.exports = mongoose.model('Speciality', specialitySchema);
