var blogTemplate = require("./blog.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var RSS = require("rss");
var uu = require("underscore");
var us = require("underscore.string");

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
    res.dust(blogTemplate, {blog: uu.findWhere(req.subject.blog, {id:req.param("post")})});
};

module.exports.feed = function(req, res) {
    var news = new RSS({
	title: req.subject.name,
	generator: "WHSB Feed Generator",
	feed_url: req.host + req.path,
	site: req.host,
	author: req.subject.teacher.username,
	webMaster: "Hashan Punchihewa",
	copyright: "Copyright Westcliff High School for Boys",
	language: "English",
	categories: ["School"]
    });
    var blog = req.subject.blog.reverse();
    uu.each(blog, function(article) {
	news.item({
	    title: article.title,
	    description: us.prune(article.body, 350),
	    guid: article._id,
	    date: article.date
	});
    });
    res.rss(news.xml());
};

module.exports.del = function(req, res) {
    req.subject.blog.pull(req.param("post"));
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else if(req.xhr) {
	    res.end();
	} else {
	    res.redirect("/subjects/" + req.param("subject"));
	}
    });
};
