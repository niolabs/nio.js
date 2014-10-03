var gulp = require('gulp')
var size = require('gulp-filesize')
var concat = require('gulp-concat')
var rename = require('gulp-rename')

// converts html to javascript templates
var jsifyTemplates = require('gulp-jsify-html-templates')
gulp.task('build/html.js', function() {
	return gulp.src('src/**/*.html')
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

var browserify = require('gulp-browserify')
gulp.task('build/bundle.js', function () {
	return gulp.src('src/nio.js')
		.pipe(browserify())
		.on('error', function (e) { console.log('Error', e.message) })
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('build'))
})

// combines html templates and javascript
gulp.task('dist/nio.js', ['build/bundle.js', 'build/html.js'], function() {
	return gulp.src(['build/html.js', 'build/bundle.js'])
		.pipe(concat('nio.js'))
		.pipe(gulp.dest('dist'))
})

// minifies js
var uglify = require('gulp-uglify')
gulp.task('dist/nio.min.js', ['dist/nio.js'], function() {
	return gulp.src('dist/nio.js')
		.pipe(uglify())
		.pipe(rename('nio.min.js'))
		.pipe(gulp.dest('dist'))
})

// compiles stylus templates and embeds images as data uris
var stylus = require('gulp-stylus')
var imprt = require('rework-import')
var nib = require('nib')
var base64 = require('gulp-base64')
gulp.task('dist/nio.css', function() {
	return gulp.src('src/nio.styl')
		.pipe(stylus({use: nib()}))
		.on('error', function (e) { console.log('Error', e) })
		.pipe(base64({baseDir: 'src/icons'}))
		.pipe(rename('nio.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('examples/*.css', function () {
	return gulp.src('examples/*.styl')
		.pipe(stylus({use: nib()}))
		.on('error', function (e) { console.log('Error', e) })
		.pipe(gulp.dest('examples'))
})

// minifies css
var csso = require('gulp-csso')
gulp.task('dist/nio.min.css', ['dist/nio.css'], function() {
	return gulp.src('dist/nio.css')
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('css', ['dist/nio.min.css', 'examples/*.css'])
gulp.task('js', ['dist/nio.min.js'])
gulp.task('build', ['css', 'js'])

gulp.task('watch', ['build'], function() {
	gulp.watch('src/**/*.html', ['js'])
	gulp.watch('src/**/*.styl', ['css'])
	gulp.watch('src/**/*.js', ['js'])
	gulp.watch('icons/**/*.svg', ['css'])
	gulp.watch('examples/*.styl', ['css'])
})

gulp.task('default', ['watch'])
