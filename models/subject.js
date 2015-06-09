var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var subjectSchema = new Schema({
    
    codeSubject: {
        type: Number,
        required: true
    },
    typeOfControl: {
        type: String,
        require: true
    },
    title: {
        type: String,
        set: capitalize
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
    property: {
        type: String,
        default: null
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

subjectSchema.path('property').validate(function(property) {
    return /short|spec|master|null/i.test(property);
}, 'Property of subject can be short, spec or master');

function capitalize(val) {
    if ('string' != typeof val) val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

module.exports = mongoose.model('Subject', subjectSchema);
