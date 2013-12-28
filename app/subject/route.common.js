// A Beautiful Example of the Craft of a Controller
var subject = require("./subject.web.js");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var RSS = require("rss");

var index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc, full: false});
	}
    });
};

var nova = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc, full: false, showNewPostForm: true});
	}
    });
};

var publish = function(req, res) {
    var update = {
	$push: {
	    blog: {
		title: req.body.title,
		body: req.body.body,
		draft: req.query.drafts === "true"
	    }
	}
    };
    Subject.findByIdAndUpdate(req.param("subject"), update, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc, full: false});
	}
    });
};

var get = function(req, res) {
    Subject.findById(req.param("subject"), {name: true, vocab_quizzes: true, blog:{$elemMatch:{_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc, full: true})
	}
    });
};

var feed = function(req, res) {
    Subject.findById(req.param("subject"), {name: true, subject_name: true, blog: true, teacher: true}, function(err, doc) {
	var news = new RSS({
	    title: subject_name,
	    generator: "WHSB Feed Generator",
	    feed_url: req.host + req.path,
	    site: req.host,
	    author: doc.teacher,
	    webMaster: "Hashan Punchihewa",
	    copyright: "Copyright Westcliff High School for Boys",
	    language: "English",
	    categories: ["School"]
	});
	doc.blog.forEach(function(post) {
	    news.item({
		title: post.title,
		description: uu.prune(post.body, 450),
		guid: post._id,
		date: post.date
	    });
	});
	res.end(news.xml());
    });
};

exports.index = index;
exports.publish = publish;
exports.get = get;
exports.nova = nova;
exports.feed = feed;