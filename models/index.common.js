var User = require("./User.common.js").User;
var Subject = require("./User.common.js").Subject;

var mongoose = require("mongoose");
mongoose.connect(process.env["DATABASE_CONNECTION"]);

var Database = new Object;
Database.subject = mongoose.model("Subject", Subject);
Database.user = mongoose.model("User", User);

exports.Database = Database;
