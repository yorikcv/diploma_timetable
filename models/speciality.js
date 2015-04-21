var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

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
    groups: [{
        type: ObjectId,
        ref: 'Group'
    }],
    created: {
        type: Date,
        default: Date.now
    }
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
