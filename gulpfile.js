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

gulp.task('compile', function () {
	return gulp.src('src/index.js')
		.pipe(handleErrors())
		.pipe($.browserify())
		//.pipe($.closureCompiler({
			//fileName: 'build.js',
			//compilerPath: 'components/closure-compiler/lib/vendor/compiler.jar'
		//}))
		.pipe($.rename('bundle.js'))
		.pipe(gulp.dest('build'))
})

// combines html templates and javascript
gulp.task('concat', ['compile'], function() {
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

gulp.task('test', ['build'], function () {
	return gulp.src('runner.html')
		.pipe(handleErrors())
		.pipe($.mochaPhantomjs({
			mocha: {
				ui: 'tdd',
				asyncOnly: true,
				bail: true,
				timeout: 1000
			}
		}))
})

gulp.task('build', ['minify'])
gulp.task('default', ['test'])
gulp.task('watch', function() {
	gulp.watch('src/**/*.{html,js}', ['default'])
})
