var gulp = require('gulp')
var myth = require('gulp-myth')
var csso = require('gulp-csso')
var size = require('gulp-filesize')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var browserify = require('gulp-browserify')
var jsifyTemplates = require('gulp-jsify-html-templates')

gulp.task('html', function () {
	return gulp.src('src/templates/*.html')
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

gulp.task('browserify', function () {
	return gulp.src('src/main.js')
		.pipe(browserify())
		.pipe(gulp.dest('build'))
})

gulp.task('js', ['browserify', 'html'], function () {
	return gulp.src(['build/html.js', 'build/main.js'])
		.pipe(concat('nio.js'))
		.pipe(gulp.dest('.'))
		.pipe(uglify())
		.pipe(rename('nio.min.js'))
		.pipe(gulp.dest('.'))
})

gulp.task('css', function () {
	return gulp.src('src/*.css')
		.pipe(myth())
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('.'))
})

gulp.task('watch', function () {
	gulp.watch('src/*.html', ['js'])
	gulp.watch('src/*.css', ['css'])
	gulp.watch('src/**/*.js', ['js'])
})

gulp.task('build', ['css', 'js'])

gulp.task('default', ['watch'])
