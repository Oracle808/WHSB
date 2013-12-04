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
	transpile: {
	    commonjs: {
		// ONLY MODEL_FILES & APP_FILES NEED TO MADE INTO COMMONJS FOR NODE
		type: "cjs",
		files: [{
		    expand: true,
		    src: [MODEL_FILES, APP_FILES, SCRIPT_FILES].concat(NO_WEB_FILES).concat(NO_TRANSPILED_FILES),
		    ext: ".common.js"
		}]
	    }
	},
	webify: {
	    node: {
		options: {
		    style: "minified",
		    banner: '/*\n<%= asciify_banner %>\n*/\n/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ ',
		    output: "node",
		},		  
		files: [{
		    expand: true,
		    src: TEMPLATE_FILES,
		    ext: ".common.js"
		}]

	    },
	    browser: {
		options: {
		    style: "minified",
		    banner: '/*\n<%= asciify_banner %>\n*/\n/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ ',
		    output: "web"
		},
		files: [{
		    expand: true,
		    src: TRANSPILED_FILES,
		    ext: ".web.js"
		}]
	    }
	},
	sass: {
	    dist: {
		options: {
		    style: "expanded",
		    loadPath: "sass"
		},
		files: [{
		    expand: true,
		    src: SASS_FILES,
		    ext: ".min.css",
		    rename: function(src, dest) {
			var dirs = dest.split("/");
			var filename = dirs.pop();
			dirs.push("static");
			dirs.push(filename);
			return dirs.join("/");
		    }
		}]
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
    grunt.loadNpmTasks("grunt-es6-module-transpiler");   // TURN ES6 MODULES INTO COMMONJS MODEULS
    grunt.loadNpmTasks("grunt-webify");                  // BUILD & MINIFY THEM FOR THE WEB
    grunt.loadNpmTasks("grunt-asciify");                 // ASCIIFY MINIFIED FILES
    grunt.loadNpmTasks("grunt-contrib-sass");            // BUILD & MINIFY SCSS FILES FOR THE WEB
    grunt.loadNpmTasks("grunt-execute");                 // RUN LOCAL TEST SERVER

    grunt.registerTask("default", ["clean", "asciify", "transpile", "webify", "sass"]);
    grunt.registerTask("serve", ["default", "execute"]);
}
