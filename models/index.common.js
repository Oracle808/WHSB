var User = require("./User.common.js").User;
var Subject = require("./User.common.js").Subject;

var mongoose = require("mongoose");
mongoose.connect("mongodb://whsb:vertex@ds053718.mongolab.com:53718/pandora");

var Database = new Object;
Database.user = mongoose.model("User", User);
Database.subject = mongoose.model("Subject", Subject);

exports.Database = Database;