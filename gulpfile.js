/* eslint-env node */

var gulp = require('gulp');

// JS
var eslint = require('gulp-eslint');

// CSS
var postcss = require('gulp-postcss');
var stylelint = require('stylelint');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var Q = require('q');
var args = require('yargs').argv;

// PATHS

var iconsSource = 'res/**/*.svg';
var stylesSource = 'styles/**/*.scss';
var stylesSource2 = 'styles2/**/*.scss';
var stylesResult = 'assets/css/';
var jsSource = 'js/*.js';
var jsResult = 'assets/js/';
var additionalStyles = [
  'node_modules/normalize.css/normalize.css',
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
    .pipe(postcss([csswring]))
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(stylesResult));
};

var CSS = function() {
  var sassOpts = {
    sourcemap: !args.production,
    noCache: args.production,
    style: 'compressed'
  };
  var processors = [
    autoprefixer({ browsers: 'last 1 version' }),
    require('postcss-inline-svg')({ path: './' }),
    require('postcss-svgo')(),
    csswring()
  ];

  return gulp.src(stylesSource2)
    .pipe(postcss([stylelint()], { syntax: scss }))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOpts))
    .pipe(sourcemaps.write())
    .pipe(postcss(processors))
    .pipe(gulp.dest(stylesResult));
};

var vendorJS = function() {
  var task =
    gulp
      .src(additionalJS, { base: 'node_modules/' })
      .pipe(concat('vendor.js'));

  if (args.production) {
    task.pipe(uglify());
  }

  return task.pipe(gulp.dest(jsResult));
};

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

var fallbackIcons = function() {
  return gulp.src(iconsSource)
    .pipe(require('gulp-svg2png')())
    .pipe(gulp.dest('assets/res'));
};

/**
 * Default task
 */
var defaultTask = function() {
  return Q.all([
    vendorCSS(), CSS(), vendorJS(), JS(), fallbackIcons()
  ]);
};

/**
 * Exports tasks & watch
 */
gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('CSS', CSS);
gulp.task('JS', JS);
gulp.task('fallbackIcons', fallbackIcons);

gulp.task('default', defaultTask);
gulp.task('watch', function() {
  defaultTask().then(function() {
    gulp.watch(stylesSource2, ['CSS']);
    gulp.watch(additionalStyles, ['vendorCSS']);
    gulp.watch(jsSource, ['JS']);
    gulp.watch(additionalJS, ['vendorJS']);
    gulp.watch(iconsSource, ['fallbackIcons']);
  });
});
