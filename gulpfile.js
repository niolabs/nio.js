'use strict';

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()

function handleErrors() {
	return $.plumber({
		errorHandler: $.notify.onError('Error: <%= error %>')
	})
}

gulp.task('lint', function () {
	return gulp.src('src/**/*.js')
		//.pipe(handleErrors())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jscs('.jscsrc'))
})

gulp.task('browserify', function () {
	return gulp.src('src/nio.js')
		.pipe(handleErrors())
		.pipe($.browserify())
		.pipe($.rename('bundle.js'))
		.pipe(gulp.dest('build'))
})

// combines html templates and javascript
gulp.task('concat', ['browserify'], function() {
	return gulp.src([
			//'vendor/CustomElements.js',
			//'vendor/time-elements.js',
			'build/bundle.js'
		])
		.pipe(handleErrors())
		.pipe($.concat('nio.js'))
		.pipe(gulp.dest('dist'))
})

// minifies js
gulp.task('minify', ['concat'], function() {
	return gulp.src('dist/nio.js')
		.pipe(handleErrors())
		.pipe($.uglify())
		.pipe($.rename('nio.min.js'))
		.pipe(gulp.dest('dist'))
})

gulp.task('test', function () {
	return gulp.src('test/runner.html')
		.pipe(handleErrors())
		.pipe($.mochaPhantomjs({mocha: {ui: 'tdd'}}))
})

gulp.task('build', ['minify'])
gulp.task('default', ['build', 'test'])
gulp.task('watch', ['default'], function() {
	gulp.watch('**/*.{html,js}', ['default'])
})
