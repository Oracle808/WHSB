var db = require("./models/index.js"),
http = require("http"),
reactive = require("./controllers/reactive"),
bodyParser = require("body-parser"),
cookieParser = require("cookie-parser"),
session = require("express-session"),
methodOverride = require("method-override"),
morgan = require("morgan"),
serveStatic = require("serve-static"),
Express = require("express");

var app = new Express(); // Instantiate Express Object
app.use(reactive()); // Add `.render` & `.error` to `res`
app.use(morgan("dev")); // Log requests
app.use(bodyParser()); // Handle form data
app.use(methodOverride()); // IMPORTANT & COMPLICATED
app.use(cookieParser(process.env["COOKIE_PARSER_SECRET"])); // Handle cookies
app.use(session()); // Handle cookie sessions
app.use(serveStatic("public")); // Serve static files

// *
// *   ROUTES
// *

var loadSubject = function(req, res, next) {
    db.subjects.findById(req.param("subject")).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    req.subject = res.locals.subject = doc;
	    next();
	}
    });
};

var Atrium = require("./controllers/home"),
Blogs = require("./controllers/blogs"),
Subjects = require("./controllers/subjects"),
VocabQuizzes = require("./controllers/vocab_quizzes"),
Apps = require("./controllers/apps"),
HandIn = require("./controllers/hand_in"),
Quizzes = require("./controllers/quizzes"),
Settings = require("./controllers/settings"),
Recordings = require("./controllers/recordings"),
Users = require("./controllers/users");

var Security = require("./controllers/security"),
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
app.get("/subjects/:subject/quizzes/nova", auth, teacher, loadSubject, Quizzes.nova);
app.post("/subjects/:subject/quizzes", auth, teacher, loadSubject, Quizzes.create);
app.del("/subjects/:subject/quizzes/:quiz", auth, teacher, loadSubject, Quizzes.del);
app.get("/subjects/:subject/quizzes", auth, loadSubject, Quizzes.list);
app.get("/subjects/:subject/quizzes/:quiz", auth, loadSubject, Quizzes.get);
app.post("/subjects/:subject/quizzes/:quiz", auth, loadSubject, Quizzes.submit);

// SUBJECT VOCAB QUIZZES
app.get("/subjects/:subject/vocab_quizzes", auth, loadSubject, VocabQuizzes.list);
app.get("/subjects/:subject/vocab_quizzes/:quiz", auth, loadSubject, VocabQuizzes.get);
app.get("/subjects/:subject/vocab_quizzes/nova", auth, teacher, loadSubject, VocabQuizzes.nova);
app.del("/subjects/:subject/vocab_quizzes/:quiz", auth, teacher, loadSubject, VocabQuizzes.del);

// SUBJECT SETTINGS
app.post("/subjects/:subject/links", auth, teacher, loadSubject, Subjects.links.post);
app.del("/subjects/:subject/links/:link", auth, loadSubject, Subjects.links.del);
app.get("/subjects/:subject/students", auth, teacher, loadSubject, Subjects.students.list);
app.del("/subjects/:subject/students/:student", auth, teacher, loadSubject, Subjects.students.unenroll);
app.get("/subjects/:subject/settings", auth, teacher, loadSubject, Settings.list);
app.post("/subjects/:subject/settings", auth, teacher, loadSubject, Settings.post);

// SUBJECT HAND-IN
app.get("/subjects/:subject/hand_in", auth, loadSubject, HandIn.index);
app.post("/subjects/:subject/hand_in", auth, teacher, loadSubject, HandIn.post);
app.get("/subjects/:subject/hand_in/:hand_in_slot/files", auth, teacher, loadSubject, HandIn.get);
app.post("/subjects/:subject/hand_in/:hand_in_slot/files", auth, loadSubject, HandIn.upload);
app.get("/subjects/:subject/hand_in/:hand_in_slot/files/:file", auth, HandIn.download);
app.del("/subjects/:subject/hand_in/:hand_in_slot", auth, teacher, loadSubject, HandIn.del);
// SUBJECT RECORDINGS
app.get("/subjects/:subject/recordings", auth, loadSubject, Recordings.list);
app.post("/subjects/:subject/recordings", auth, teacher, loadSubject, Recordings.post);
app.get("/subjects/:subject/recordings/:recording", auth, loadSubject, Recordings.get);
app.del("/subjects/:subject/recordings/:recording", auth, loadSubject, Recordings.del);

// APPS
app.get("/apps", auth, Apps.index);
app.get("/apps/codr", auth, Apps.codr);

// USERS
app.get("/users/massUserCreation", auth, admin, Users.massUserCreation);
app.post("/users/massUserCreation", auth, admin, Users.postMassUserCreation);
app.get("/users", auth, teacher, Users.list); // So teachers can add users

// Start
app.listen(process.env.PORT);
console.log("Express web server @ http://localhost:" + process.env.PORT)
