var Database = require("../models/index.js");
var path = require("path");
var http = require("http");
var express = require("express");
var app = express();
var reactive = require("./reactive");

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
app.use(express.cookieParser(process.env["COOKIE_PARSER_SECRET"]));
app.use(express.session());
//	app.use(express.csrf());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(app.router);
app.use(reactive.howler());

// *
// *   ROUTES
// *

var Admin = require("./admin"),
Atrium = require("./home"),
Blogs = require("./blogs"),
Subjects = require("./subjects"),
Quizzes = require("./quizzes"),
VocabQuizzes = require("./vocab_quizzes"),
Apps = require("./apps"),
HandIn = require("./hand_in"),
Settings = require("./settings"),
Recordings = require("./recordings"),
Users = require("./users");

var Security = require("./security"),
auth = Security.auth,
teacher = Security.teacher,
admin = Security.admin,
logout = Security.logout;

// INDEX
app.get("/", auth, Atrium.index);
app.get("/login", Atrium.login.form);
app.post("/login", Atrium.login.attempt);
app.get("/logout", auth, logout);
// SUBJECTS
app.del("/subjects/:subject", auth, admin, Subjects.del);
app.get("/subjects/nova", auth, admin, Subjects.nova);
app.post("/subjects/nova", auth, admin, Subjects.post);
// SUBJECT BLOGS
app.get("/subjects/:subject", auth, loadSubject, Blogs.list);
app.post("/subjects/:subject", auth, teacher, loadSubject, Blogs.publish);
app.get("/subjects/:subject/feed", loadSubject, Blogs.feed); // Authentication not necessary so RSS clients can access
app.get("/subjects/:subject/posts/:post", auth, loadSubject, Blogs.get);
app.del("/subjects/:subject/posts/:post", auth, teacher, loadSubject, Blogs.del);
// SUBJECT QUIZZES
app.get("/subjects/:subject/quizzes", auth, loadSubject, Quizzes.list);
app.get("/subjects/:subject/quizzes/nova", auth, teacher, loadSubject, Quizzes.nova);
app.post("/subjects/:subject/quizzes", auth, teacher, loadSubject, Quizzes.publish);
app.get("/subjects/:subject/quizzes/:quiz", auth, loadSubject, Quizzes.get);
app.post("/subjects/:subject/quizzes/:quiz", auth, loadSubject, Quizzes.submit);
app.del("/subjects/:subject/quizzes/:quiz", auth, teacher, loadSubject, Quizzes.del);
// SUBJECT VOCAB QUIZZES
app.get("/subjects/:subject/vocab_quizzes", auth, loadSubject, VocabQuizzes.list);
app.get("/subjects/:subject/vocab_quizzes/nova", auth, teacher, loadSubject, VocabQuizzes.nova);
app.get("/subjects/:subject/vocab_quizzes/:quiz", auth, loadSubject, VocabQuizzes.get);
app.del("/subjects/:subject/vocab_quizzes/:quiz", auth, teacher, loadSubject, VocabQuizzes.del);
// SUBJECT
app.post("/subjects/:subject/links", auth, teacher, loadSubject, Subjects.links.post);
app.del("/subjects/:subject/links/:link", auth, loadSubject, Subjects.links.del);
app.get("/subjects/:subject/students", auth, teacher, loadSubject, Subjects.students.list);
app.del("/subjects/:subject/students/:student", auth, teacher, loadSubject, Subjects.students.unenroll);
// SUBJECT
app.get("/subjects/:subject/settings", auth, teacher, loadSubject, Settings.list);
app.post("/subjects/:subject/settings", auth, teacher, loadSubject, Settings.post);
// HAND-IN
app.get("/subjects/:subject/hand_in", auth, loadSubject, HandIn.index);
app.post("/subjects/:subject/hand_in", auth, teacher, loadSubject, HandIn.post);
app.get("/subjects/:subject/hand_in/:hand_in_slot/files", auth, teacher, loadSubject, HandIn.get);
app.post("/subjects/:subject/hand_in/:hand_in_slot/files", auth, loadSubject, HandIn.upload);
app.get("/subjects/:subject/hand_in/:hand_in_slot/files/:file", auth, HandIn.download);
app.del("/subjects/:subject/hand_in/:hand_in_slot", auth, teacher, loadSubject, HandIn.del);
// RECORDINGS
app.get("/subjects/:subject/recordings", auth, loadSubject, Recordings.list);
app.post("/subjects/:subject/recordings", auth, teacher, loadSubject, Recordings.post);
app.get("/subjects/:subject/recordings/:recording", auth, loadSubject, Recordings.get);
app.del("/subjects/:subject/recordings/:recording", auth, loadSubject, Recordings.del);
// APPS
app.get("/apps", auth, Apps.index);
app.get("/apps/codr", auth, Apps.codr);
// USERS
app.get("/admin/users/massUserCreation", auth, admin, Admin.massUserCreation);
app.post("/admin/users/massUserCreation", auth, admin, Admin.postMassUserCreation);
app.get("/users", auth, teacher, Users.list); // So teachers can add users, it is teacher not admin

http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port %d in %s mode", app.get("port"), app.settings.env);
});
