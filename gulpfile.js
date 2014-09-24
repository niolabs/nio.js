var gulp = require('gulp'),
	size = require('gulp-filesize'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename');

// html
var minifyHTML = require('gulp-minify-html'),
	jsifyTemplates = require('gulp-jsify-html-templates');

// javascript
var uglify = require('gulp-uglify'),
	browserify = require('gulp-browserify');

// stylesheets
var myth = require('gulp-myth'),
	csso = require('gulp-csso'),
	base64 = require('gulp-base64');

// converts html to javascript templates
gulp.task('build/html.js', function() {
	return gulp.src('src/**/*.html')
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

gulp.task('dist/nio.js', ['build/html.js'], function() {
	gulp.src('src/core.js')
		.pipe(browserify())
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('build'))

	return gulp.src(['build/html.js', 'build/bundle.js'])
		.pipe(concat('nio.js'))
		.pipe(gulp.dest('dist'))
})

gulp.task('dist/nio.min.js', ['dist/nio.js'], function() {
	return gulp.src('dist/nio.js')
		.pipe(uglify())
		.pipe(rename('nio.min.js'))
		.pipe(gulp.dest('dist'))
})

gulp.task('dist/nio.css', function() {
	return gulp.src(['src/core.css'])
		.pipe(myth())
		.pipe(base64({baseDir: 'src/icons'}))
		.pipe(gulp.dest('dist'))
})

gulp.task('dist/nio.min.css', ['dist/nio.css'], function() {
	return gulp.src('dist/nio.css')
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('css', ['dist/nio.min.css'])
gulp.task('js', ['dist/nio.min.js'])
gulp.task('build', ['css', 'js'])

gulp.task('watch', ['build'], function() {
	gulp.watch('src/**/*.html', ['js'])
	gulp.watch('src/**/*.css', ['css'])
	gulp.watch('src/**/*.js', ['js'])
	gulp.watch('icons/**/*.svg', ['css'])
})

gulp.task('default', ['watch'])
