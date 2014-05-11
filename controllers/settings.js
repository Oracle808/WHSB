var settingsView = require("../views/settings.dust"),
async = require("async"),
db = require("../models");

exports.list = function(req, res) {
    res.render(settingsView);
};

exports.post = function(req, res) {
    if(req.subject.name !== req.body.name) {
	console.log(req.body.name);
	req.subject.set("name", req.body.name); // Only set if not modified
    }
    req.body.vocab_quizzes = (req.body.vocab_quizzes === "on");
    req.body.quizzes = (req.body.quizzes === "on");
    req.body.student_resources = (req.body.student_resources === "on");
    req.body.recordings = (req.body.student_resources === "on");
    if(req.subject.settings.vocab_quizzes !== req.body.vocab_quizzes) {
	if(!req.body.vocab_quizzes) {
	    req.subject.set("vocab_quizzes", []);
	}
	req.subject.set("settings.vocab_quizzes", req.body.vocab_quizzes);
    }
    if(req.subject.settings.quizzes !== req.body.quizzes) {
	if(!req.body.vocab_quizzes) {
	    req.subject.set("quizzes", []);
	}
	req.subject.set("settings.quizzes", req.body.quizzes);
    }
   if(req.subject.settings.recordings !== req.body.recordings) {
       async.each(req.subject.recordings, function(recording, cb) {
	   db.gfs.unlink({_id: recording.file}, function(err) {
	       if(!err) {
		   req.subject.recordings.pull(recording);
	       }
	       cb(err);
	   });
       }, function(err) {
	   req.subject.save(function(err2) {
	       if(err || err2) {
		   res.error(err || err2);
	       } else {
		   exports.list(req, res);
	       }
	   });
       });
   } else {
       req.subject.save(function(err) {
	   if(err) {
	       res.error(err);
	   } else {
	       exports.list(res, res);
	   }
       });
   }
};
