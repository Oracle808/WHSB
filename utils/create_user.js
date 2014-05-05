var inquirer = require("inquirer");
var db = require("../models/index.js");

inquirer.prompt([
    {name: "username", message: "Username: "},
    {name: "password", message: "Password: ", type: "password"},
    {name: "role", message: "Role: ", type: "list", choices: ["student", "teacher", "admin"]}
], function(data) {
    db.users.create({
	username: data.username,
	password: data.password,
	role: data.role
    });
});
