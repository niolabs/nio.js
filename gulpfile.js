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

gulp.task('build/bundle.js', function () {
	return gulp.src('src/nio.js')
		.pipe(handleErrors())
		.pipe($.browserify())
		.pipe($.rename('bundle.js'))
		.pipe(gulp.dest('build'))
})

// combines html templates and javascript
gulp.task('dist/nio.js', ['build/bundle.js'], function() {
	return gulp.src('build/bundle.js')
		.pipe(handleErrors())
		.pipe($.concat('nio.js'))
		.pipe(gulp.dest('dist'))
})

// minifies js
gulp.task('dist/nio.min.js', ['dist/nio.js'], function() {
	return gulp.src('dist/nio.js')
		.pipe(handleErrors())
		.pipe($.uglify())
		.pipe($.rename('nio.min.js'))
		.pipe(gulp.dest('dist'))
})

// compiles stylus templates and embeds images as data uris
var nib = require('nib')
gulp.task('dist/nio.css', function() {
	return gulp.src('src/nio.styl')
		.pipe(handleErrors())
		.pipe($.stylus({
			use: nib(),
			paths: [
				'src',
				'node_modules/nio.css'
			]
		}))
		.pipe($.base64({baseDir: 'src/icons'}))
		.pipe($.rename('nio.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('examples/*.css', function () {
	return gulp.src('examples/*.styl')
		.pipe(handleErrors())
		.pipe($.stylus({use: nib()}))
		.pipe(gulp.dest('examples'))
})

gulp.task('elements/*.css', function () {
	return gulp.src('elements/*.styl')
		.pipe(handleErrors())
		.pipe($.stylus({use: nib()}))
		.pipe(gulp.dest('elements'))
})

// minifies css
gulp.task('dist/nio.min.css', ['dist/nio.css'], function() {
	return gulp.src('dist/nio.css')
		.pipe(handleErrors())
		.pipe($.csso())
		.pipe($.rename('nio.min.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('css', ['dist/nio.min.css', 'examples/*.css', 'elements/*.css'])
gulp.task('js', ['dist/nio.min.js'])
gulp.task('build', ['css', 'js'])

gulp.task('default', ['build'])
gulp.task('watch', ['default'], function() {
	gulp.watch('**/*.{html,js}', ['js'])
	gulp.watch('**/*.{svg,styl}', ['css'])
})
