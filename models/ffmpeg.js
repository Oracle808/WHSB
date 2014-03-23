var stream = require("stream");
var util = require("util");
var spawn = require("child_process").spawn;

module.exports.createProcess = function(options) {
    var args = [];
    if(options.contentType) {
	args.push("-f");
	args.push(options.contentType);
    }
    args.push("-i");
    args.push("pipe:0"); // Read input from stdin
    if(options.audioChannels) {
	args.push("-ac");
	args.push(options.audioChannels);
    }
    if(options.audioCodec) {
	args.push("-acodec");
	args.push(options.audioCodec);
    }
    if(options.audioFrequency) {
	args.push("-ar");
	args.push(options.audioFrequency);
    }
    if(options.audioBitrate) {
	args.push("-ab");
	args.push(options.audioBitrate);
    }
    if(options.removeAudio) {
	args.push("-an");
    }
    if(options.videoCodec) {
	args.push("-vcodec");
	args.push(options.videoCodec);
    }
    if(options.removeVideo) {
	args.push("-vn");
    }
    if(options.format) {
	args.push("-f");
	args.push(options.format);
    }
    if(options.experimental) {
	args.push("-strict");
	args.push("experimental");
    }
    if(options.duration) {
	args.push("-t");
	args.push(options.duration);
    }
    if(options.sameQuality) {
	args.push("-sameq");
    }
    args.push("pipe:1"); // Pipe output to stdout

    return spawn("ffmpeg", args);
};
