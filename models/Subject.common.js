 var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
	ref: "user"
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
    }]
});

exports = Subject;var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

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
	ref: "user"
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
    }]
});

exports = Subject;