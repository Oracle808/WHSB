module.exports = function(grunt) {

    var TEMPLATE_FILES = ["app/**/*.ejs"];
    var TRANSPILED_FILES = ["app/**/*.common.js", "components/**/*.common.js", "scripts/**/*.common.js", "models/**/*.common.js"];
    var NO_TRANSPILED_FILES = ["!app/**/*.common.js", "!components/**/*.common.js", "!scripts/**/*.common.js", "!models/**/*.common.js"];
    var WEB_FILES = ["app/**/*.web.js", "scripts/**/*.web.js", "components/**/*.web.js"];
    var NO_WEB_FILES = ["!app/**/*.web.js", "!scripts/**/*.web.js", "!components/**/*.web.js", "!models/**/*.web.js"];
    var MINIFIED_CSS_FILES = ["components/**/*.min.css", "app/**/*.min.css", "scripts/**/*.min.css"];
    var MODEL_FILES = "models/**/*.js";
    var APP_FILES = "app/**/*.js";
    var COMPONENT_FILES = ["components/**/*.js"];
    var SCRIPT_FILES = "scripts/**/*.js";
    var SASS_FILES = ["components/**/*.scss", "app/**/*.scss", "components/**/*.sass", "app/**/*.sass", "sass/**/*.sass"];

    var CONFIGURATION = grunt.file.readJSON("package.json");

    grunt.initConfig({
	pkg: CONFIGURATION,
	clean: {
	    build: {
		src: TRANSPILED_FILES.concat(WEB_FILES).concat(MINIFIED_CSS_FILES)
	    }
	},
	asciify: {
	    banner: {
		// FOR THE WHIMSY OF IT
		text: "HASHAN!"
	    }
	},
	webify: {
	    web: {
		options: {
		    sass: {
			includePaths: ["./sass", "./app"]
		    }
		},
		files: [
		    {
			expand: true,
			src: TEMPLATE_FILES,
			ext: ".web.js"
		    },
		    {
			expand: true,
			src: [MODEL_FILES, APP_FILES, SCRIPT_FILES].concat(NO_WEB_FILES).concat(NO_TRANSPILED_FILES),
			ext: ".common.js"
		    }
		]
	    }
	},
	execute: {
	    dev: {
		src: CONFIGURATION.main
	    }
	}
    });

    // This is how you develop...
    grunt.loadNpmTasks("grunt-contrib-clean");           // GET RID OF EXISTING BUILT FILES
    grunt.loadNpmTasks("grunt-asciify");                 // ASCIIFY MINIFIED FILES
    grunt.loadNpmTasks("grunt-webify");                  // BUILD & MINIFY THEM FOR THE WEB
    grunt.loadNpmTasks("grunt-execute");                 // RUN LOCAL TEST SERVER

    grunt.registerTask("default", ["clean", "asciify", "webify"]);
    grunt.registerTask("serve", ["default", "execute"]);
};
