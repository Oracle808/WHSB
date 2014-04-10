var blogTemplate = require("./blog.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var RSS = require("rss");
var uu = require("underscore");
var us = require("underscore.string");

var query = function(id, select, update, cb) {
    var desirable = uu.extend({name: true, subject_name: true, vocab_quizzes: true, teacher: true, blog: true, links:true}, select);
    var query = Subject.findById(id).select(desirable).populate("teacher");
    if(typeof update === "function") {
	query.exec(update);
    } else {
	query.update(update).exec(cb);
    }
};

module.exports.list = function(req, res) {
    var blog = req.subject.blog.reverse(); // We want `blog` in reverse-chronological order
    if(req.session.user.role === "student") {
	blog = uu.filter(blog, function(article) {
	    return !article.draft; // Hide drafts to students
	});
    }
    uu.each(blog, function(article) {
	article.body = us.prune(article.body, 350);
    });
    res.dust(blogTemplate, {blog:blog});
};

module.exports.publish = function(req, res) {
    req.subject.blog.push({
	title: req.body.title,
	body: decodeURIComponent(req.body.body),
	draft: req.query.drafts === "true",
	mode: req.body.mode
    });
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    module.exports.list(req, res);
	}
    });
};

module.exports.get = function(req, res) {
    query(req.param("subject"), {blog: {$elemMatch: {_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var blog = doc.blog.reverse();
	    res.dust(blogTemplate, {subject:doc, blog: blog});
	}
    });
};

module.exports.feed = function(req, res) {
    var news = new RSS({
	title: doc.name,
	generator: "WHSB Feed Generator",
	feed_url: req.host + req.path,
	site: req.host,
	author: doc.teacher,
	webMaster: "Hashan Punchihewa",
	copyright: "Copyright Westcliff High School for Boys",
	language: "English",
	categories: ["School"]
    });
    var blog = req.subject.blog.reverse();
    uu.each(blog, function(article) {
	news.item({
	    title: post.title,
	    description: us.prune(post.body, 350),
	    guid: post._id,
	    date: post.date
	});
    });
    res.rss(news.xml());
};

module.exports.del = function(req, res) {
    req.subject.blog.pull(req.param("post"));
    req.subject.save(function(err) {
	if(req.xhr) {
	    res.end();
	} else {
	    res.redirect("/subjects/" + req.param("subject"));
	}
    });
};
