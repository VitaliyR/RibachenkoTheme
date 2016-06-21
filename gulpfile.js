/* eslint-env node */

var gulp = require('gulp');

// JS
var eslint = require('gulp-eslint');

// CSS
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var Q = require('q');
var args = require('yargs').argv;

// PATHS

var stylesSource = 'styles/**/*.scss';
var stylesResult = 'assets/css/';
var jsSource = 'js/*.js';
var jsResult = 'assets/js/';
var additionalStyles = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/font-awesome/css/font-awesome.min.css',
  'node_modules/image-fullscreen/dist/image-fullscreen.css',
  'vendor/prism.css'
];
var additionalJS = [
  'node_modules/image-fullscreen/dist/image-fullscreen.js',
  'vendor/jquery.mousewheel.js',
  'vendor/jquery.jscrollpane.min.js',
  'vendor/prism.js'
];

// TASKS

var vendorCSS = function() {
  return gulp.src(additionalStyles, { base: 'node_modules/' })
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(stylesResult));
};

function CSS() {
  // var sassOpts = {
  //   sourcemap: !args.production,
  //   noCache: args.production,
  //   style: 'compressed'
  // };

  var processors = [];
  var opts = {
    syntax: scss
  };

  return gulp.src(stylesSource)
    .pipe(postcss(processors, opts))
    // .pipe(sourcemaps.init())
    // .pipe(sass(sassOpts))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(stylesResult));
}

function fontAwesome() {
  return gulp.src('node_modules/font-awesome/fonts/**.*')
    .pipe(gulp.dest('assets/fonts'));
}

var vendorJS = function() {
  var task =
    gulp
      .src(additionalJS, { base: 'node_modules/' })
      .pipe(concat('vendor.js'));

  if (args.production) {
    task.pipe(uglify());
  }

  return task.pipe(gulp.dest(jsResult));
}

var JS = function() {
  var task =
    gulp
      .src(jsSource)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(concat('app.js'));

  if (args.production) {
    task.pipe(uglify());
  }

  return task.pipe(gulp.dest(jsResult));
};

var defaultTask = function() {
  return Q.all([
    vendorCSS(), CSS(), fontAwesome(), vendorJS(), JS()
  ]);
};


gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('font-awesome', fontAwesome);
gulp.task('CSS', CSS);
gulp.task('JS', JS);

gulp.task('default', defaultTask);
gulp.task('watch', function() {
  defaultTask().then(function() {
    gulp.watch(stylesSource, ['CSS']);
    gulp.watch(additionalStyles, ['vendorCSS']);
    gulp.watch(jsSource, ['JS']);
    gulp.watch(additionalJS, ['vendorJS']);
  });
});
