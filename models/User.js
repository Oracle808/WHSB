var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
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
	type: ObjectId,
	required:true,
	ref: "User"
    },
    links : [{
	title: {
	    type: String
	},
	url: {
	    type: String
	}
    }],
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
    quizzes: [{
	title: {
	    type: String,
	    required: true
	}, 
	questions: {
	    type: [{
		problem: {
		    type: String,
		    required: true
		},
		help_text: {
		    type: String
		},
		solution: {
		    type: Mixed,
		    required: true
		},
		wrongs: [String]
	    }],
	    required: true
	},
	attempts: [{
	    date: {
		type: Date,
		default: Date.now,
		required: true
	    },
	    score: {
		type: Number,
		required:true
	    },
	    user: {
		type: ObjectId,
		ref: "User"
	    },
	    answers: [Mixed]
	}]
    }],
    vocab_quizzes: [{
	title: {
	    type: String,
	    required: true
	},
	body:[{
	    question: {
		type: String,
		required: true
	    },
	    answer: [{
		type: String,
		required: true
	    }]
	}]
    }],
    hand_in: [{
	name: {
	    type: String,
	    required: true
	},
	due_in: {
	    type: Date
	},
	files: [{
	    user: {
		type: ObjectId,
		required: true,
		ref: "User"
	    },
	    file: {
		type: ObjectId,
		required:true
	    }
	}]
    }]
});

module.exports.User = User;
module.exports.Subject = Subject;
