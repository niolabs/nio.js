'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


gulp.task('compile', function () {
	return gulp.src('src/index.js')
		.pipe(plugins.browserify())
		.pipe(plugins.rename('nio.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify', ['compile'], function() {
	return gulp.src('dist/nio.js')
		.pipe(plugins.uglify())
		.pipe(plugins.rename('nio.min.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
	return gulp.src('tests/*.js')
		.pipe(plugins.jasmine({
			verbose: true
		}));
});

gulp.task('build', ['compile', 'test', 'minify']);
gulp.task('watch', function() {
	gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
