import { User, Subject } from "./User.common.js";

var mongoose = require("mongoose");
mongoose.connect(process.env["DATABASE_CONNECTION"]);

var Database = new Object;
Database.user = mongoose.model("User", User);
Database.subject = mongoose.model("Subject", Subject);

export { Database };

