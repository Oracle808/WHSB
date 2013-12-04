// A Beautiful Example of the Craft of a Controller
var TS = require("../../scripts/Streams.common.js").TS;
var subject = require("./subject.common.js").subject;

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

exports.SubjectController = SubjectController;