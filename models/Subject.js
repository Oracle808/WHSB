var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

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
	},
	mode: {
	    type: String
	    // E.g. "rich-text-editing", "latex", and perhaps in the future "markdown"
	}
    }],
    quizzes: [{
	title: {
	    type: String,
	    required: true
	},
	questions: [{
	    answer_type: { // "text", "number", "radio", "checkbox"
		type: String,
		required: true
	    },
	    content: {
		type: String
	    },
	    content_mode: {
		type: String,
		default:"rich-text-editing" 
	    },
	    help_text: {
		type: String
	    },
	    answer: {
		type: Mixed, // Type depends on `answer_type`
		required: true
	    },
	    opts: [String]
	}],
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
	}],
	randomise_questions: {
	    type: Boolean,
	    required: true,
	    default: true
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
    }],
    recordings: [{
	name: {
	    type: String,
	    required: true
	},
	file: {
	    type: ObjectId,
	    required: true
	}
    }],
    pages: [{
	title: {
	    type: String,
	    required: true
	},
	content: {
	    type: String,
	    required: true
	}
    }],
    settings: {
	quizzes: {
	    type: Boolean,
	    required: true,
	    default: true
	},
	vocab_quizzes: {
	    type: Boolean,
	    required: true,
	    default: false
	},
	student_resources: {
	    type: Boolean,
	    required: true,
	    default: true
	},
	recordings: {
	    type: Boolean,
	    required: true,
	    default: false
	}
    }
});

module.exports = Subject;
