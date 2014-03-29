var mongoose = require("mongoose"),
child_process = require("duplex-child-process"),
mime = require("mime"),
uu = require("underscore"),
Grid = require("gridfs-stream"),
ObjectID  = mongoose.mongo.BSONPure.ObjectID;

var gfs = new Grid(mongoose.connection.db, mongoose.mongo);

mime.define({
    "audio/mp3": ["mp3"]
});

var Subject = mongoose.model("Subject");
var listView = require("./list.dust");
var Busboy = require("busboy");

module.exports.list = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

module.exports.post = function(req, res) {
    var name, id;
    var busboy = new Busboy({
	headers: req.headers,
	limits: {
	    files: 1,
	    fileSize: 1024 * 1024 * 5
	}
    });
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
	id = new ObjectID();
	var store = gfs.createWriteStream({
	    content_type: mimetype,
	    _id: id,
	    filename: filename,
	    mode: "w"
	});
	file.pipe(store);
    });
    busboy.on("field", function(key, val) {
	if(key === "name") {
	    name = val;
	}
    });
    busboy.on("finish", function() {
	if(!name || !id) {
	    Subject.findById(req.param("subject"), function(err, doc) {
		if(!name && !id) {
		    res.dust(listView, {subject:doc, error: "A name and a file must be chosen required"});
		} else if(!name) {
		    res.dust(listView, {subject:doc, error: "A name must be chosen"});
		} else if(!id) {
		    res.dust(listView, {subject:doc, error: "A file must be chosen"});
		}
	    });
	} else {
	    Subject.findByIdAndUpdate(req.param("subject"), {$push: {recordings: {name: name, file: id}}}, function(err, doc) {
		if(err) {
		    res.error(err);
		} else {
		    res.dust(listView, {subject:doc});
		}
	    });
	}
    });
    req.pipe(busboy);
};

module.exports.get = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	var recording = uu.findWhere(doc.recordings, {id: req.param("recording")}).file;
	gfs.files.findOne({_id:recording}, function(err, file) {
	    if(err) {
		res.error(err);
	    } else {
		var store = gfs.createReadStream({_id: recording});
		var contentType = mime.extension(file.contentType);
		res.attachment(file.filename);
		res.set("Content-Length", file.length);
		console.log(req.query.format);
		if(contentType === req.query.format) {
		    res.set("Content-Type", file.contentType);
		    store.pipe(res);
		} else if(req.query.format === "webm") {
		    console.log("fsdfdssdffsd");
		    var converter = child_process.spawn("ffmpeg", ["-f", contentType, "-acodec", "mp3", "-vn",  "-i", "pipe:0", "-ac", "2", "-strict", "experimental", "-acodec", "vorbis", "-f", "webm", "pipe:1"], {
			customFds: [-1, -1, -1]
		    });
		    store.pipe(converter);
		    res.set("Content-Type", mime.lookup("webm"));
		    converter.pipe(res);
		}
	    }
	});
    });
};

module.exports.del = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	var fileId = uu.findWhere(doc.recordings, {id: req.param("recording")}).file;
	gfs.remove({_id:fileId}, function(err) {
	    if(err) {
		res.error(err);
	    } else {
		doc.recordings.pull(req.param("recording"));
		doc.save(function(err) {
		    res.dust(listView, {subject: doc});
		});
	    }
	});
    });
};
