var gulp = require('gulp')
var myth = require('gulp-myth')
var csso = require('gulp-csso')
var size = require('gulp-filesize')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var compass = require('gulp-compass')
var browserify = require('gulp-browserify')
var minifyHTML = require('gulp-minify-html')
var jsifyTemplates = require('gulp-jsify-html-templates')

gulp.task('html', function () {
	return gulp.src('html/**/*.html')
		//.pipe(minifyHTML())
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

gulp.task('browserify', function () {
	return gulp.src('js/main.js')
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
	return gulp.src('css/**/*.scss')
		.pipe(compass({
			sass: 'css',
			css: 'build',
			require: ['sass-globbing']
		}))
		.pipe(rename('nio.css'))
		.pipe(gulp.dest('.'))
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('.'))
})

gulp.task('watch', function () {
	gulp.watch('html/**/*.html', ['js'])
	gulp.watch('css/**/*.scss', ['css'])
	gulp.watch('js/**/*.js', ['js'])
})

gulp.task('build', ['css', 'js'])

gulp.task('default', ['watch'])
