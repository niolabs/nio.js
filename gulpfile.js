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
var base64 = require('gulp-base64')
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('html', function() {
	return gulp.src('src/**/*.html')
		//.pipe(minifyHTML())
		.pipe(jsifyTemplates())
		.pipe(concat('html.js'))
		.pipe(gulp.dest('build'))
})

var tsProject = ts.createProject({
	declarationFiles: true,
	module: 'commonjs'
	//noExternalResolve: true
})
gulp.task('ts', ['html'], function() {
	var tsResult = gulp.src('src/nio.ts')
		.pipe(sourcemaps.init())
		//.pipe(ts(tsProject))
		.pipe(ts({
			declarationFiles: true,
			module: 'commonjs'
		}))

	tsResult.dts.pipe(gulp.dest('dist'))

	tsResult.js
		.pipe(browserify())
		.pipe(rename('browserify.js'))
		.pipe(gulp.dest('build'))

	return gulp.src(['build/html.js', 'build/browserify.js'])
		.pipe(concat('nio.js'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(rename('nio.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
})

gulp.task('css', function() {
	return gulp.src(['src/**/*.css'])
		.pipe(concat('nio.css'))
		.pipe(myth())
		.pipe(base64({
			baseDir: 'icons'
		}))
		.pipe(gulp.dest('dist'))
		.pipe(csso())
		.pipe(rename('nio.min.css'))
		.pipe(gulp.dest('dist'))
})

gulp.task('watch', ['build'], function() {
	gulp.watch('src/**/*.html', ['ts'])
	gulp.watch('src/**/*.css', ['css'])
	gulp.watch('src/**/*.ts', ['ts'])
	gulp.watch('icons/**/*.svg', ['css'])
})

gulp.task('build', ['css', 'ts'])

gulp.task('default', ['watch'])


