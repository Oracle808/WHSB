var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var listView = require("./list.dust");
var detailView = require("./detail.dust");
var GridFS = require("../../models/gridfs");
var uu = require("underscore");
var async = require("async");

module.exports.index = function(req, res) {
    Subject.findById(req.param("subject")).exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

module.exports.post = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {$push: {hand_in: {name: req.body.name, files: []}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

module.exports.upload = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var previousFile;
	    var handInSlot;
	    for(var i = 0; i < doc.hand_in.length; i++) {
		if(doc.hand_in[i]._id.equals(req.param("hand_in_slot"))) {
		    handInSlot = doc.hand_in[i];
		}
	    }
	    if(!handInSlot) {
		res.error("An attempt was made to upload a file to a hand in slot which is non-existant");
	    } else {
		for(i = 0; i < handInSlot.files.length; i++) {
		    if(handInSlot.files[i].user.equals(req.session.user._id)) {
			previousFile = handInSlot.files[i]._id;
		    }
		}
		var fileRefs = [];
		req.busboy.on("file", function(fieldname, file, filename) {
		    GridFS.openGridFile(filename, function(err, store) {
			if(err) {
			    res.error(err);
			} else {
			    fileRefs.push(store.fileId);
			    file.on("data", function(data) {
				store.write(data);
			    });
			    file.on("end", function() {
				store.close();
			    });
			}
		    });
		});
		req.busboy.on("end", function() {
		    if(previousFile) {
			handInSlot.files.pull(previousFile);
		    }
		    handInSlot.files.push({user: req.session.user._id, file: fileRefs[0]});
		    doc.save(function(err, doc) {
			if(err) {
			    res.error(err);
			} else {
			    res.end();
			}
		    });
		});
		req.pipe(req.busboy);
	    }
	}
    });
};

module.exports.get = function(req, res) {
    Subject.findById(req.param("subject")).select({hand_in: { $elemMatch: {_id: req.param("hand_in_slot")}}}).populate("hand_in.files.user").exec(function(err, docs) {
	res.dust(detailView, {subject: docs, hand_in_slot: docs.hand_in[0]});
    });
};

module.exports.download = function(req, res) {
    GridFS.getGridFile(req.param("file"), function(err, file) {
	if(err) {
	    res.error(err);
	} else {
	    res.attachment(file.filename);
	    file.stream(true).pipe(res);
	}
    });
};

module.exports.del = function(req, res) {
    Subject.findById(req.param("subject")).exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var hand_in_slot;
	    for(var i = 0; i < doc.hand_in.length; i++) {
		if(doc.hand_in[i]._id.equals(req.param("hand_in_slot"))) {
		    hand_in_slot = doc.hand_in[i];
		}
	    }
	    if(!hand_in_slot) {
		res.error("Hand in slot doesn't exist");
	    } else {
		async.each(uu.pluck(hand_in_slot.files, "file"), GridFS.deleteGridFile, function(err) {
		    if(err) {
			res.error(err);
		    } else {
			doc.hand_in.pull(hand_in_slot);
			doc.save(function(err) {
			    if(err) {
				res.error(err);
			    } else {
				res.dust(listView, {subject:doc});
			    }
			});
		    }
		});
	    }
	}
    });
};
