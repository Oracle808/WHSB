var Program = require("commander");
var Inquirer = require("inquirer");
var Database = require("./models/index.common.js").Database;
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
	{name: "role", message: "Role: ", type: "list", choices: ["pupil", "teacher", "admin"]}
    ], function(data) {
	Database.user.create({
	    username: data["username"],
	    password: data["password"],
	    role: data["role"]
	});
    });
} else if(Program.createSubject) {
    Inquirer.prompt([
	{name: "name", message: "Name: "},
	{name: "subjectName", message: "Subject Name: "}
    ], function(data) {
	Database.subject.create({
	    name: data["name"],
	    subject_name: data["subjectName"],
	    blog: [],
	    vocab_quizzes: []
	});
    });
} else {
    var http = require("http");
    var express = require("express");
    var app = express();

    var Atrium = require("./app/index/route.common");
    var Subject = require("./app/subject/route.common");
    var reactive = require("./reactive");

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
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
    app.use(reactive.howler());

    app.get("/", auth, Atrium.index);
    app.get("/login", Atrium.login.form);
    app.post("/login", Atrium.login.attempt);
    app.get("/logout", auth, logout);
    app.get("/:subject", auth, Subject.index);
    app.post("/:subject", auth, teacher, Subject.publish);
    app.get("/:subject/nova", auth, teacher, Subject.nova);
    app.get("/:subject/:post", auth, Subject.get);

    http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening at " + app.get("port"));
    });
}
