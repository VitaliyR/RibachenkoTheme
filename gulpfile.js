var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var Q = require('q');
var args = require('yargs').argv;

var stylesSource = 'styles/';
var stylesResult = 'assets/css/';
var additionalStyles = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/font-awesome/css/font-awesome.min.css'
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

function defaultTask() {
  return Q.all([
    vendorCSS(), CSS(), fontAwesome()
  ]);
}

gulp.task('vendorCSS', vendorCSS);
gulp.task('font-awesome', fontAwesome);
gulp.task('CSS', CSS);

gulp.task('default', defaultTask);

gulp.task('watch', function () {
  defaultTask().then(function(){
    gulp.watch(stylesSource + '**/*', ['CSS']);
    gulp.watch(additionalStyles, ['vendorCSS']);
  });
});
