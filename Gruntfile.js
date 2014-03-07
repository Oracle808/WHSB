module.exports = function(grunt) {

    var TEMPLATE_FILES = "**/*.dust";
    var MODEL_FILES = "models/**/*.js";
    var NO_MODEL_FILES = "!models/**/*.common.js";
    var APP_FILES = "**/*.js";

    var CONFIGURATION = grunt.file.readJSON("package.json");

    grunt.initConfig({
	pkg: CONFIGURATION,
	asciify: {
	    banner: {
		// FOR THE WHIMSY OF IT
		text: "HASHAN!"
	    }
	},
	clean: {
	    styles: {
		src: ["public/styles/*"]
	    },
	    scripts: {
		src: ["public/scripts/*"]
	    }
	},
	sass: {
	    options: {
		outputStyle: "compressed"
	    },
	    build: {
		files: [{
		    expand: "true",
		    cwd: "styles/",
		    src: "**/*.scss",
		    dest: "public/styles/",
		    ext: ".css"
		}]
	    }
	},
	browserify: {
	    build: {
		options: {
		    transform: ["browserify-dustjs"]
		},
		files: [{
		    expand:true,
		    cwd: "scripts/",
		    src: "**/*.js",
		    dest:"public/scripts/"
		}]
	    }
	},
	uglify: {
	    build: {
		options: {
		    banner:"/*<%= asciify_banner %>\n Copyright Hashan Punchihewa 10C */\n"
		},
		files: [{
		    expand: true,
		    src:["public/scripts/**/*.js"]
		}]
	    }
	}
    });

    // This is how you develop...
    grunt.loadNpmTasks("grunt-contrib-clean");           // CLEAN BUILD
    grunt.loadNpmTasks("grunt-contrib-uglify");          // MINIFY JAVASCRIPT
    grunt.loadNpmTasks("grunt-sass");                    // BUILD SASS
    grunt.loadNpmTasks("grunt-browserify");              // BROWSERFIY
    grunt.loadNpmTasks("grunt-asciify");                 // ASCIIFY MINIFIED FILES
    grunt.loadNpmTasks("grunt-foreman");                 // TEST SERVER

    grunt.registerTask("default", ["clean", "sass", "browserify", "asciify", "uglify"]);
    grunt.registerTask("serve", ["default", "foreman"]);

};
