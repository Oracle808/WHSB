var Program = require("commander");
var Inquirer = require("inquirer");
var Database = require("../models/index.js");
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
    var Quizzes = require("./quizzes");
    var VocabQuizzes = require("./vocab_quizzes");
    var Apps = require("./apps");
    var Users = require("./users");
    var HandIn = require("./hand_in");
    var Settings = require("./settings");
    var Recordings = require("./recordings");

    var auth = function(req, res, next) {
	if(req.session.user) {
	    res.locals.user = req.session.user;
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

    var loadSubject = function(req, res, next) {
	Database.subject.findById(req.param("subject")).populate("teacher").exec(function(err, doc) {
	    if(err) {
		res.error(err);
	    } else {
		req.subject = res.locals.subject = doc;
		next();
	    }
	});
    };

    app.set('port', process.env.PORT || 3000);
    app.use(reactive.intercept());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
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
    app.get("/subjects/:subject", auth, loadSubject, Blogs.list);
    app.post("/subjects/:subject", auth, teacher, loadSubject, Blogs.publish);
    app.get("/subjects/:subject/feed", loadSubject, Blogs.feed); // Authentication not necessary so RSS clients can access
    app.get("/subjects/:subject/posts/:post", auth, loadSubject, Blogs.get);
    app.del("/subjects/:subject/posts/:post", auth, teacher, loadSubject, Blogs.del);
    // SUBJECT QUIZZES
    app.get("/subjects/:subject/quizzes", auth, Quizzes.list);
    app.get("/subjects/:subject/quizzes/nova", auth, Quizzes.nova);
    app.post("/subjects/:subject/quizzes", auth, Quizzes.publish);
    app.get("/subjects/:subject/quizzes/:quiz", auth, Quizzes.get);
    app.post("/subjects/:subject/quizzes/:quiz", auth, Quizzes.submit);
    app.del("/subjects/:subject/quizzes/:quiz", auth, teacher, Quizzes.del);
    // SUBJECT VOCAB QUIZZES
    app.get("/subjects/:subject/vocab_quizzes", auth, loadSubject, VocabQuizzes.list);
    app.get("/subjects/:subject/vocab_quizzes/:quiz", auth, loadSubject, VocabQuizzes.get);
    app.del("/subjects/:subject/vocab_quizzes/:quiz", auth, teacher, loadSubject, VocabQuizzes.del);
    // SUBJECT
    app.post("/subjects/:subject/links", auth, teacher, Subjects.links.post);
    app.del("/subjects/:subject/links/:link", auth, Subjects.links.del);
    app.get("/subjects/:subject/students", auth, teacher, loadSubject, Subjects.students.list);
    // SUBJECT
    app.get("/subjects/:subject/settings", auth, teacher, Settings.index);
    // HAND-IN
    app.get("/subjects/:subject/hand_in", auth, loadSubject, HandIn.index);
    app.post("/subjects/:subject/hand_in", auth, teacher, loadSubject, HandIn.post);
    app.get("/subjects/:subject/hand_in/:hand_in_slot/files", auth, teacher, HandIn.get);
    app.post("/subjects/:subject/hand_in/:hand_in_slot/files", auth, loadSubject, HandIn.upload);
    app.get("/subjects/:subject/hand_in/:hand_in_slot/files/:file", auth, HandIn.download);
    app.del("/subjects/:subject/hand_in/:hand_in_slot", auth, teacher, HandIn.del);
    // RECORDINGS
    app.get("/subjects/:subject/recordings", auth, loadSubject, Recordings.list);
    app.post("/subjects/:subject/recordings", auth, teacher, loadSubject, Recordings.post);
    app.get("/subjects/:subject/recordings/:recording", auth, Recordings.get);
    app.del("/subjects/:subject/recordings/:recording", auth, loadSubject, Recordings.del);
    // APPS
    app.get("/apps", auth, Apps.index);
    app.get("/apps/codr", auth, Apps.codr);
    // USERS
    app.get("/users/massUserCreation", auth, admin, Users.massUserCreation);
    app.post("/users/massUserCreation", auth, admin, Users.postMassUserCreation);

    http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port %d in %s mode", app.get("port"), app.settings.env);
    });
}
