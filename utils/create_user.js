var Inquirer = require("inquirer");
var Database = require("../models/index.js");

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
