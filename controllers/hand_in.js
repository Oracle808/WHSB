var Busboy = require("busboy"),
listView = require("../views/hand_ins.dust"),
detailView = require("../views/hand_in.dust"),
db = require("../models"),
uu = require("underscore"),
async = require("async");

exports.index = function(req, res) {
    res.render(listView);
};

exports.post = function(req, res) {
    req.subject.hand_in.push({
	name: req.body.name,
	files: []
    });
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    exports.index(req, res);
	}
    });
};

exports.upload = function(req, res) {
    console.log("upload start");
    var busboy = new Busboy({
	headers: req.headers,
	limits: {
	    files: 1,
	    fileSize: 1024 * 1024 * 5
	}
    });
    console.log("busboy set up");
    var previousFile;
    var handInSlot = uu.findWhere(req.subject.hand_in, {id: req.param("hand_in_slot")});
    console.log(handInSlot);

    if(!handInSlot) {
	console.log("no hand_in_slot");
	return res.error("An attempt was made to upload a file to a hand in slot which is non-existant");
    }
    for(var i = 0; i < handInSlot.files.length; i++) {
	if(handInSlot.files[i].user.equals(req.session.user._id)) {
	    previousFile = handInSlot.files[i]._id;
	}
    }
    var fileRefs = [];
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
	fileRefs.push(new db.ObjectID());
	console.log(fileRefs[0]);
	var store = db.gfs.createWriteStream({
	    filename: filename,
	    content_type: mimetype,
	    _id: fileRefs[0],
	    mode:"w"
	});
	file.pipe(store);
	console.log("begun uploading to database");
    });
    busboy.on("finish", function() {
	console.log("at end");
	if(previousFile) {
	    db.gfs.remove({_id: previousFile.file}, function(err) {
		if(err) {
		    res.error(err);
		    handInSlot.files.pull(previousFile);
		    handInSlot.files.push({user: req.session.user._id, file: fileRefs[0]});
		    req.subject.save(function(err, doc) {
			if(err) {
			    res.error(err);
			} else {
			    res.end();
			}
		    });
		}
	    });
	} else {
	    handInSlot.files.push({user: req.session.user._id, file: fileRefs[0]});
	    req.subject.save(function(err, doc) {
		if(err) {
		    res.error(err);
		} else {
		    res.end();
		}
	    });
	}
    });
    req.pipe(busboy);
};

exports.get = function(req, res) {
    req.subject.populate("hand_in.user", function(err, doc) {
	res.render(detailView, {hand_in_slot: uu.findWhere(doc.hand_in, {id: req.param("hand_in_slot")})});
    });
};

exports.download = function(req, res) {
    var store = db.gfs.createReadStream(req.param("file"));
    store.on("filename", res.attachment);
    store.pipe(res);
};

exports.del = function(req, res) {
    var hand_in_slot = uu.findWhere(req.subject.hand_in, {id: req.param("hand_in_slot")});
    if(!hand_in_slot) {
	return res.error("Hand in slot doesn't exist");
    }
    async.each(uu.pluck(hand_in_slot.files, "file"), db.gfs.unlink, function(err) {
	if(err) {
	    return res.error(err);
	}
	req.subject.hand_in.pull(hand_in_slot);
	req.subject.save(function(err) {
	    if(err) {
		res.error(err);
	    } else {
		res.render(listView);
	    }
	});
    });
};
