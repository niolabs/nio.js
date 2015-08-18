'use strict';

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()


gulp.task('compile', function () {
	return gulp.src('src/index.js')
		.pipe(plugins.browserify())
		.pipe(plugins.rename('nio.js'))
		.pipe(gulp.dest('dist'))
})

gulp.task('build', ['compile'])
gulp.task('watch', function() {
	gulp.watch('src/**/*.js', ['build'])
})

gulp.task('default', ['build', 'watch'])
