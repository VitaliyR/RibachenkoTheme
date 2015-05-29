var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var args = require('yargs').argv;

var stylesSource = 'styles/';
var stylesResult = 'assets/css/';
var additionalStyles = [
  'node_modules/normalize.css/normalize.css'
];

gulp.task('vendorCSS', function () {
  return gulp.src(additionalStyles)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(stylesResult));
});

gulp.task('CSS', function () {
  var sassOpts = {
    sourcemap: !args.production,
    noCache: args.production,
    style: 'compressed'
  };

  return sass(stylesSource, sassOpts)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(stylesResult));
});

gulp.task('default', ['CSS', 'vendorCSS']);

gulp.task('watch', function () {
  gulp.watch(stylesSource + '*', ['CSS']);
  gulp.watch(additionalStyles, ['vendorCSS']);
});