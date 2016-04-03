/* requires */

var gulp		= require('gulp'),
	util		= require('gulp-util'),
	browserSync = require('browser-sync'),
	cache 		= require('gulp-cached'),
	fileinclude = require('gulp-file-include'),
	rename		= require('gulp-rename'),
	concat		= require('gulp-concat'),
	filter 		= require('gulp-filter'),
	rimraf		= require('rimraf'),

	autoprefixr	= require('autoprefixer'),
	nocomments	= require('postcss-discard-comments'),
	sass		= require('gulp-sass'),
	postcss 	= require('gulp-postcss'),
	minifyCSS	= require('gulp-minify-css');

/* paths */

var input = {
		html: 'dev/example/**/*.html',
		scss: 'dev/scss/**/*.scss',
		images: 'dev/example/images/*'
	},
	output = {
		dist: 'dist',
		main: 'example',
		css: 'example/css',
		images: 'example/images'
	};

gulp.task('default', ['build', 'server', 'watch']);

gulp.task('build', ['markup', 'styles', 'images']);

gulp.task('markup', function() {
	gulp.src(input.html)
		.pipe(fileinclude().on('error', util.log))
		.pipe(cache('htmling'))
		.pipe(filter(['*', '!dev/example/includes']))
		.pipe(gulp.dest(output.main))
		.pipe(browserSync.stream());
});

gulp.task('styles', function() {
	gulp.src(input.scss)
		.pipe(concat('awsm.scss'))
		.pipe(sass().on('error', util.log))

		.pipe(postcss([ autoprefixr({ browsers: [ "> 1%" ] }), nocomments() ]))
		.pipe(gulp.dest(output.css))
		.pipe(gulp.dest(output.dist))

		.pipe(minifyCSS())
		.pipe(rename('awsm.min.css'))
		.pipe(gulp.dest(output.css))
		.pipe(gulp.dest(output.dist))

		.pipe(browserSync.stream());
});

gulp.task('images', function() {
	gulp.src(input.images) 
		.pipe(gulp.dest(output.images))
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
	gulp.watch(input.html, ['markup']);
	gulp.watch(input.scss, ['styles']);
	gulp.watch(input.images, ['images']);
});

gulp.task('clean', function(cb) {
	rimraf(output.main, cb);
});