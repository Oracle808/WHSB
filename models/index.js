var User = require("./User.js").User;
var Subject = require("./User.js").Subject;

var mongoose = require("mongoose");
mongoose.connect(process.env["DATABASE_CONNECTION"]);

var Database = new Object;
Database.subject = mongoose.model("Subject", Subject);
Database.user = mongoose.model("User", User);

module.exports = Database;

