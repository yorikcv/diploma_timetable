var crypto = require('crypto');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });


userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

// userSchema.statics.authorize = function(username, password, callback) {
//   var User = this;

//   async.waterfall([
//     function(callback) {
//       User.findOne({username: username}, callback);
//     },
//     function(user, callback) {
//       if (user) {
//         if (user.checkPassword(password)) {
//           callback(null, user);
//         } else {
//           callback(new AuthError("Пароль неверен"));
//         }
//       } else {
//         var user = new User({username: username, password: password});
//         user.save(function(err) {
//           if (err) return callback(err);
//           callback(null, user);
//         });
//       }
//     }
//   ], callback);
// };

module.exports = mongoose.model('User', userSchema);

