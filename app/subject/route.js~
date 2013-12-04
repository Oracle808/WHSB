// A Beautiful Example of the Craft of a Controller
import { TS } from  "../../scripts/Streams.common.js";
import { subject } from "./subject.common.js";

var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");

var SubjectController = TS.Resource.extend({
    name: "subject", 

    get: function(req) {
	var self = this;
	Subject.findById(req.id, function(err, doc) {
	    if(err) throw err;
	    self.out.render(subject, {subject: doc});
	});
    }
});

export { SubjectController };
