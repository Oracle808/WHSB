import { DS } from "../scripts/Streams.common.js";
import { User, Subject } from "./User.common.js";

var mongoose = require("mongoose");
mongoose.connect("mongodb://whsb:vertex@ds053718.mongolab.com:53718/pandora");

var Database = new Object;
Database.user = mongoose.model("User", User);
Database.subject = mongoose.model("Subject", Subject);

export { Database };

