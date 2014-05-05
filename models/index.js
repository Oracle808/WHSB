var mongoose = require("mongoose");
var User = require("./User");
var Subject = require("./Subject");

mongoose.connect(process.env["DATABASE_CONNECTION"]);
exports.subjects = mongoose.model("Subject", Subject);
exports.users = mongoose.model("User", User);
exports.disconnect = mongoose.disconnect.bind(mongoose);
