module.exports = function(grunt) {

    var TEMPLATE_FILES = "**/*.dust";
    var MODEL_FILES = "models/**/*.js";
    var NO_MODEL_FILES = "!models/**/*.common.js";
    var APP_FILES = "**/*.js";

    var CONFIGURATION = grunt.file.readJSON("package.json");

    grunt.initConfig({
	pkg: CONFIGURATION,
	clean: {
	    build: {
		src: ["build/", "models/**/*.common.js"]
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
		    esnext: true,
		    sass: {
			includePaths: ["app", "bower_components/foundation/scss"],
			outputStyle: "expanded"
		    }
		},
		files: [
		    {
			expand: true,
			cwd:"app/",
			src: TEMPLATE_FILES,
			dest: "build/"
		    },
		    {
			expand: true,
			cwd:"app/",
			src: APP_FILES,
			dest:"build/"
		    },
		    {
			expand: true,
			src: MODEL_FILES,
			ext: ".common.js"
		    }
		]
	    }
	}
    });

    // This is how you develop...
    grunt.loadNpmTasks("grunt-contrib-clean");           // CLEAN BUILD
    grunt.loadNpmTasks("grunt-asciify");                 // ASCIIFY MINIFIED FILES
    grunt.loadNpmTasks("grunt-webify");                  // BUILD & MINIFY THEM FOR THE WEB
    grunt.loadNpmTasks("grunt-foreman");                 // TEST SERVER

    grunt.registerTask("default", ["clean", "asciify", "webify"]);
    grunt.registerTask("serve", ["default", "foreman"]);

};
