var mongoose = require("mongoose"),
stream = require("stream"),
uu = require("underscore"),
db = mongoose.connection.db;

var GridStore = mongoose.mongo.GridStore,
Grid      = mongoose.mongo.Grid,
ObjectID  = mongoose.mongo.BSONPure.ObjectID;

exports.open = function(id, flags, options, cb) {
    if(typeof options === "function") {
	cb = options;
	options = {root:"fs"};
    }
    new GridStore(db, id, flags, options).open(cb);
};

exports.createReadStream = function(id, cb) {
    var Stream = new stream.PassThrough();
    this.open(id, "r", function(err, store) {
	if(err) {
	    Stream.emit("error", err);
	    console.log("eRROR");
	} else {
	    console.log("wghdfgdgfd");
	    Stream.emit("filename", store.filename);
	    Stream.emit("mimetype", store.contentType);
	    store.stream(true).pipe(Stream);
	}
    });
    return Stream;
};

exports.createWriteStream = function(filename, options) {
    var Stream = new stream.PassThrough();
    Stream.pause();
    Stream._id = new ObjectID();
    this.open(Stream._id, "w", uu.extend(options, {filename: filename}), function(err, store) {
	if(err) {
	    Stream.emit("error", err);
	} else {
	    Stream.on("data", function(buf) {
		console.log(buf);
		store.write(buf.toString(), function(err, store) {
		    if(err) {
			Stream.emit("error", err);
		    }
		});
	    });
	    Stream.on("end", function() {
		store.close();
	    });
	    Stream.on("error", function() {
		store.close();
	    });
	    Stream.resume();
	}
    });
    return Stream;
};

exports.writeFile = function(filename, data, options, cb) {
    if(typeof options === "function") {
	cb = options;
	options = {};
    }
    if(!options.metadata) {
	options.metadata = {};
    }
    options.metadata.filename = name;

    new GridStore(db, filename, "w", options).open(function(err, file){
	if (err) {
	    return cb(err);
	} else {
	    file.write(data, true, cb);
	}
    });

};

exports.unlink = function(id, fn){
    var db= mongoose.connection.db;
    new GridStore(db, id, 'r', {root: 'fs'}).unlink(fn);
};
