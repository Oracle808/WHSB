var spawn = require("child_process").spawn;

module.exports = function(grunt) {
    grunt.registerTask("foreman", function() {
	var done = this.async();
	var foreman = spawn("foreman", ["start"]);
	foreman.stdout.pipe(process.stdout);
	foreman.stderr.pipe(process.stderr);
	process.stdin.pipe(foreman.stdin);
	foreman.on("exit", done);
    });
};
