var gulp = require("gulp");
var sass = require("gulp-sass");
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var modernizr = require('gulp-modernizr');
var prefix = require('gulp-autoprefixer');

gulp.task("clean", function() {
    return gulp.src(["public/styles", "public/scripts"], {read:false}). // Do no read files
	pipe(clean());
});

var displayError = function(error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
	errorString += ' in ' + error.fileName;

    if(error.lineNumber)
	errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
};

gulp.task("styles", function() {
    return gulp.src("styles/**/*.scss")
	.pipe(sass({
	    outputStyle: 'compressed',
	    includePaths: ["./"],
	    errLogToConsole: true
	}))
	.pipe(prefix("last 2 version", "ie 8"))
	.pipe(gulp.dest("./public/styles"));
});

gulp.task("scripts", function() {
    return gulp.src("scripts/**/*.js")
	.pipe(browserify({
	    transform: ["browserify-dustjs"],
	    extensions: [".dust"]
	}))
	.pipe(uglify())
	.pipe(gulp.dest("./public/scripts"));
});

gulp.task("modernizr", function() {
    gulp.src(["styles/**/*.scss", "scripts/**/*.js"])
	.pipe(modernizr())
	.pipe(gulp.dest("./public/scripts"));
});

gulp.task("default", ["clean", "styles", "scripts", "modernizr"]);
