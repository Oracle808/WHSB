var gulp = require("gulp"),
sass = require("gulp-sass"),
browserify = require('gulp-browserify'),
uglify = require('gulp-uglify'),
clean = require('gulp-clean'),
prefix = require('gulp-autoprefixer');

gulp.task("clean", function() {
    return gulp.src(["public/styles", "public/scripts"], {read:false}) // Do no read files
	.pipe(clean());
});

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

gulp.task("default", ["clean"], function() {
    gulp.start("styles", "scripts");
});
gulp.task("heroku:production", ["default"]);
