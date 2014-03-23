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
	console.log(doc);
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

module.exports.post = function(req, res) {
    console.log("START");
    var name, id;
    var busboy = new Busboy({
	headers: req.headers,
	limits: {
	    files: 1,
	    fileSize: 1024 * 1024 * 5
	}
    });
    console.log(busboy);
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
	id = new ObjectID();
	console.log(id);
	var store = gfs.createWriteStream({
	    content_type: mimetype,
	    _id: id,
	    filename: filename,
	    mode: "w"
	});
	file.pipe(store);
    });
    busboy.on("field", function(key, val) {
	console.log("NEW FIELD");
	if(key === "name") {
	    console.log("WE HAVE A MATCH");
	    name = val;
	}
    });
    busboy.on("finish", function() {
	console.log("FINISH");
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

var spawn = require("child_process").spawn;

module.exports.get = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	console.log(req.param("recording"));
	console.log("fdsfds");
	console.log(req.query.format);
	var recording = uu.findWhere(doc.recordings, {id: req.param("recording")}).file;
	gfs.files.find({_id:recording}).toArray(function(err, files) {
	    console.log(files);
	    if(err) {
		res.error(err);
	    } else {
		var store = gfs.createReadStream({_id: recording});
		var contentType = mime.extension(files[0].contentType);
		res.attachment(files[0].filename);
		res.set("Content-Type", files[0].contentType);
		res.set("Content-Length", files[0].length);
		console.log(req.query.format);
		if(contentType === req.query.format) {
		    store.pipe(res);
		    console.log("hier");
		} else if(req.query.format === "webm") {
		    var converter = child_process.spawn("ffmpeg", ["-f", contentType, "-acodec", "mp3", "-vn",  "-i", "pipe:0", "-ac", "2", "-strict", "experimental", "-acodec", "vorbis", "-f", "webm", "pipe:1"], {
			customFds: [-1, -1, -1]
		    });
		    store.pipe(converter);
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
