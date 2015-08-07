var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var Q = require('q');
var args = require('yargs').argv;

var stylesSource = 'styles/';
var stylesResult = 'assets/css/';
var jsSource = 'js/';
var jsResult = 'assets/js/';
var additionalStyles = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/font-awesome/css/font-awesome.min.css',
  'node_modules/image-fullscreen/dist/image-fullscreen.css'
];
var additionalJS = [
  'node_modules/image-fullscreen/dist/image-fullscreen.js'
];


function vendorCSS() {
  return gulp.src(additionalStyles, { base: 'node_modules/' })
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(stylesResult));
}

function CSS() {
  var sassOpts = {
    sourcemap: !args.production,
    noCache: args.production,
    style: 'compressed'
  };

  return sass(stylesSource, sassOpts)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(stylesResult));
}

function fontAwesome() {
  return gulp.src('node_modules/font-awesome/fonts/**.*')
    .pipe(gulp.dest('assets/fonts'));
}

function vendorJS() {
  return gulp.src(additionalJS, { base: 'node_modules/' })
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(jsResult));
}

function JS() {

}

function defaultTask() {
  return Q.all([
    vendorCSS(), CSS(), fontAwesome(), vendorJS(), JS()
  ]);
}


gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('font-awesome', fontAwesome);
gulp.task('CSS', CSS);

gulp.task('default', defaultTask);
gulp.task('watch', function () {
  defaultTask().then(function(){
    gulp.watch(stylesSource + '**/*', ['CSS']);
    gulp.watch(additionalStyles, ['vendorCSS']);
    gulp.watch(jsSource, ['JS']);
    gulp.watch(additionalJS, ['vendorJS']);
  });
});
