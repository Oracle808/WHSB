var mongoose = require("mongoose");
var Grid = require("gridfs-stream");
var User = require("./User");
var Subject = require("./Subject");

mongoose.connect(process.env["DATABASE_CONNECTION"]);
exports.subjects = mongoose.model("Subject", Subject);
exports.users = mongoose.model("User", User);
exports.gfs = new Grid(mongoose.connection.db, mongoose.mongo);
exports.ObjectID = mongoose.mongo.BSONPure.ObjectID;
exports.disconnect = mongoose.disconnect.bind(mongoose);
