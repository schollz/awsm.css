/* requires */

var gulp		= require('gulp'),
	util		= require('gulp-util'),
	browserSync = require('browser-sync'),
	cache 		= require('gulp-cached'),
	fileinclude = require('gulp-file-include'),
	rename		= require('gulp-rename'),
	filter 		= require('gulp-filter'),
	rimraf		= require('rimraf'),

	autoprefixr = require('autoprefixer-core'),
	sass		= require('gulp-sass'),
	postcss 	= require('gulp-postcss'),
	minifyCSS	= require('gulp-minify-css');

/* paths */

var mask = {
		html: 'dev/example/**/*.html',
		css: 'dev/css/style.css',
	},
	input = {
		css: 'dev/css',
		scss: 'dev/scss/style.scss'
	},
	output = {
		main: 'example',
		css: 'example/css',
	};

gulp.task('default', ['build', 'server', 'watch']);

gulp.task('build', ['html', 'scss', 'css']);

gulp.task('html', function() {
	gulp.src(mask.html)
		.pipe(fileinclude().on('error', util.log))
		.pipe(cache('htmling'))
		.pipe(filter(['*', '!dev/example/includes']))
		.pipe(gulp.dest(output.main))
		.pipe(browserSync.stream());
});

gulp.task('scss', function() {
	gulp.src(input.scss)
		.pipe(sass().on('error', util.log))
		.pipe(gulp.dest(input.css))
});

gulp.task('css', function() {
	gulp.src(mask.css)
		.pipe(cache('cssing'))
		.pipe(postcss([ autoprefixr({ browsers: [ "> 1%" ] }) ]))
		.pipe(rename('awsm.css'))
		.pipe(gulp.dest(output.css))
		.pipe(minifyCSS())
		.pipe(rename('awsm.min.css'))
		.pipe(gulp.dest(output.css))
		.pipe(browserSync.stream());
});

gulp.task('server', function() {
	browserSync.init({
		server: output.main,
		open: false,
		browser: "browser",
		reloadOnRestart: true
	});
});

gulp.task('watch', function() {
	gulp.watch(mask.html, ['html']);
	gulp.watch(input.scss, ['scss']);
	gulp.watch(mask.css, ['css']);
});

gulp.task('clean', function(cb) {
	rimraf(output.main, cb);
});