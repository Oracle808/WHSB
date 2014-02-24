var settingsView = require("./settings.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");

module.exports.index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(settingsView);
	}
    });
};
