var Program = require("commander");
var Inquirer = require("inquirer");
var Database = require("./models/index.common.js").Database;
var Atrium = require("./app/index/route.common.js").Atrium;

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
    Atrium.listen(Program.port, {
	favicon: true,
	logger: true,
	open: "app",
	session: {
	    secret: "uber seecret"
	}
    });
}
