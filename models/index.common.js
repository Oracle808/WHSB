 var User = require("./User.common.js").User;
var Subject = require("./User.common.js").Subject;

var mongoose = require("mongoose");
mongoose.connect(process.env["DATABASE_CONNECTION"]);

var Database = new Object;
Database.user = mongoose.model("User", User);
Database.subject = mongoose.model("Subject", Subject);

exports.Database = Database;