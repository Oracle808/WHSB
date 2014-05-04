var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var User = mongoose.Schema({
    username: {
	type: String,
	required: true
    },
    password: {
	type: String,
	required: true
    },
    role: {
	type: String,
	required: true,
	default: "student"
    },
    subjects: [{
	type: ObjectId,
	ref:"Subject"
    }]
});

User.pre("save", function(next) {
    var user = this;

    if(!user.isModified("password")){
	return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	if(err) return next(err);

	bcrypt.hash(user.password, salt, function(err, hash){
	    if(err) return next(err);

	    user.password = hash;
	    next();
	});
    });
});

module.exports = User;
