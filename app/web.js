var Program = require("commander");
var Inquirer = require("inquirer");
var Database = require("../models/index.common.js").Database;
var path = require("path");

Program
    .version("0.0.1")
    .option("-p, --port [number]", "Specify Port to Listen At", process.env.PORT || 4000, parseInt)
    .option("-c, --create-user", "Create A User Account")
    .option("-s, --create-subject", "Create A Subject")
    .parse(process.argv);


if(Program.createUser) {
    Inquirer.prompt([
	{name: "username", message: "Username: "},
	{name: "password", message: "Password: ", type: "password"},
	{name: "role", message: "Role: ", type: "list", choices: ["student", "teacher", "admin"]}
    ], function(data) {
	Database.user.create({
	    username: data.username,
	    password: data.password,
	    role: data.role
	});
    });
} else if(Program.createSubject) {
    Inquirer.prompt([
	{name: "name", message: "Name: "},
	{name: "subjectName", message: "Subject Name: "}
    ], function(data) {
	Database.subject.create({
	    name: data.name,
	    subject_name: data.subjectName,
	    blog: [],
	    vocab_quizzes: []
	}, function(err) {
	    if(err) {
		throw err;
	    } else {
		console.log("Done.");
	    }
	});
    });
} else {
    var http = require("http");
    var express = require("express");
    var app = express();

    var reactive = require("./reactive");

    var Atrium = require("./home");
    var Blogs = require("./blogs");
    var Subjects = require("./subjects");
    var VocabQuizzes = require("./vocab_quizzes");
    var Apps = require("./apps");
    var Codr = require("./codr");
    var Users = require("./users");
    var HandIn = require("./hand_in");

    var auth = function(req, res, next) {
	if(req.session.user) {
	    next();
	} else {
	    res.redirect("/login?redirect=" + encodeURIComponent(req.path));
	}
    };

    var teacher = function(req, res, next) {
	if(req.session.user.role === "teacher" || req.session.user.role === "admin") {
	    next();
	} else {
	    res.forbid("An attempt was made to access a route restricted to staff.");
	}
    };

    var admin = function(req, res, next) {
	if(req.session.user.role === "admin") {
	    next();
	} else {
	    res.forbid("An attempt was made to access a route prohibited to all but administrators.");
	}
    };

    var logout = function(req, res) {
	delete req.session.user;
	res.redirect("/login");
    };

    app.set('port', process.env.PORT || 3000);
    app.use(reactive.intercept());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('my secret here'));
    app.use(express.session());
    //	app.use(express.csrf());
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use(app.router);
    app.use(reactive.howler());

    // *
    // *   ROUTES
    // *

    // INDEX
    app.get("/", auth, Atrium.index);
    app.get("/login", Atrium.login.form);
    app.post("/login", Atrium.login.attempt);
    app.get("/logout", auth, logout);
    // SUBJECTS
    app.get("/subjects/nova", auth, admin, Subjects.nova);
    app.post("/subjects/nova", auth, admin, Subjects.post);
    // SUBJECT BLOGS
    app.get("/subjects/:subject", auth, Blogs.index);
    app.post("/subjects/:subject", auth, teacher, Blogs.publish);
    app.get("/subjects/:subject/feed", auth, Blogs.feed);
    app.get("/subjects/:subject/posts/:post", auth, Blogs.get);
    app.del("/subjects/:subject/posts/:post", auth, teacher, Blogs.del);
    // SUBJECT VOCAB QUIZZES
    app.get("/subjects/:subject/vocab_quizzes", auth, VocabQuizzes.index);
    app.get("/subjects/:subject/vocab_quizzes/:quiz", auth, VocabQuizzes.get);
    // SUBJECT LINKS
    app.post("/subjects/:subject/links", auth, teacher, Subjects.postLink);
    app.del("/subjects/:subject/links/:link", auth, Subjects.delLink);
    // HAND-IN
    app.get("/subjects/:subject/hand_in", auth, HandIn.index);
    app.post("/subjects/:subject/hand_in", auth, teacher, HandIn.post);
    // APPS
    app.get("/apps", auth, Apps.index);
    app.get("/apps/codr", auth, Codr.index);
    // USERS
    app.get("/users/massUserCreation", auth, admin, Users.massUserCreation);
    app.post("/users/massUserCreation", auth, admin, Users.postMassUserCreation);

    http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening at " + app.get("port"));
    });
}
