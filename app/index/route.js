import { TS } from "../../scripts/Streams.common.js";
import { login } from "./login.common.js";
import { index } from "./index.common.js";
import { SubjectController } from "../subject/route.common.js";

var mongoose = require("mongoose");
var User = mongoose.model("User");
var Subject = mongoose.model("Subject");
var LocalStrategy = require("passport-local").Strategy;

var bcrypt = require("bcrypt");

var Atrium = TS.Controller.extend({
    static: __dirname + "/static",

    // BAM!! PassportJS Intergration
    passport: new LocalStrategy(function(username, password, done) {
	User.findOne({username: username}, function(err, user) {
	    if(err) return done(err);
	    else if(!user) return done(null, false, { message: "Incorrect Crededentials" });

	    bcrypt.compare(password, user.password, function(err, isMatch) {
		if(err) return done(err);
		if(isMatch) return done(null, user);
		else return done(null, false, { message: "Incorrect Crededentials"});
	    });
	});
    }),

    illicit: function(req) {
	this.out.render(login);
    },

    login: function(req, info) {
	this.out.render(login, info);
    },

    index: function(req, res) {
	Subject
	    .where("_id").in(req.session.user.subjects)
	    .select("name subject_name")
	    .exec(function(err, subjects) {
		if(err) {
		    this.out.writeHead(501);
		    this.out.end(err.toString());
		} else {
		    this.out.render(index, {subjects: subjects});
		}
	    }.bind(this));
    },

    subs: {
	"subject": SubjectController
    }
});

export { Atrium };
