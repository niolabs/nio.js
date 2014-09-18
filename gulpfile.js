var gulp = require('gulp')
var myth = require('gulp-myth')
var csso = require('gulp-csso')
var size = require('gulp-filesize')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var browserify = require('gulp-browserify')
var minifyHTML = require('gulp-minify-html')
var jsifyTemplates = require('gulp-jsify-html-templates')

gulp.task('html', function () {
	return gulp.src('src/**/*.html')
		//.pipe(minifyHTML())
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

gulp.task('js', ['html'], function () {
	return gulp.src(['build/html.js', 'src/resig.js', 'src/nio.js'])
		.pipe(concat('nio.js'))
		.pipe(gulp.dest('.'))
		.pipe(uglify())
		.pipe(rename('nio.min.js'))
		.pipe(gulp.dest('.'))
})

gulp.task('css', function () {
	return gulp.src('src/**/*.css')
		.pipe(myth())
		.pipe(rename('nio.css'))
		.pipe(gulp.dest('.'))
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('.'))
})

gulp.task('watch', ['build'], function () {
	gulp.watch('src/**/*.html', ['js'])
	gulp.watch('src/**/*.css', ['css'])
	gulp.watch('src/**/*.js', ['js'])
})

gulp.task('build', ['css', 'js'])

gulp.task('default', ['watch'])
