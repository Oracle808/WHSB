/*
 * The sole purpose of this file is to avoid
 * is to avoid repeating three lines of code
*/ 
var mongoose = require("mongoose");
var Grid = require("gridfs-stream");
module.exports = new Grid(mongoose.connection.db, mongoose.mongo);
