var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var Subject = mongoose.Schema({
    name: {
	type: String,
	required: true
    },
    subject_name: {
	type: String,
	required: true
    },
    teacher: {
	type: String,
	required:true
    },
    blog: [{
	title: {
	    type: String,
	    required: true
	},
	body: {
	    type: String,
	    required: true
	},
	draft: {
	    type: Boolean
	},
	date: {
	    type: Date,
	    default: Date.now
	}
    }],
    vocab_quizzes: [{
	title: {
	    type: String,
	    required: true
	},
	body: {
	    type: Mixed,
	    required: true
	}
    }]
});

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
	default: "pupil"
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
	})
    });
});

exports.User = User;
exports.Subject = Subject;