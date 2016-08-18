/* eslint-env node */

var gulp = require('gulp');

// JS
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

// CSS
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var stylelint = require('stylelint');
var csswring = require('csswring');

var postcss_scss = require('postcss-scss');
var postcss_inline_svg = require('postcss-inline-svg');
var postcss_svgo = require('postcss-svgo');

var sass = require('gulp-sass');
var svg2png = require('gulp-svg2png');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var args = require('yargs').argv;

// utils
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var clone = require('gulp-clone');
var cheerio = require('gulp-cheerio');
var rename = require('gulp-rename');
var globby = require('globby');
var gutil = require('gulp-util');
var del = require('del');
var through = require('through2');
var es = require('event-stream');
var _ = require('lodash');

// PATHS

var config = {
  outputDir: 'assets/'
};
_.extend(config,
  {
    filesJS: 'js/**/*.js',
    entryJS: 'js/app.js',
    outputJS: 'app.js',
    outputJSDir: config.outputDir + 'js',
    vendorJS: [
      // 'vendor/jquery.mousewheel.js',
      // 'vendor/jquery.jscrollpane.min.js',
      'vendor/prism.js'
    ],
    outputVendorJS: 'vendor.js'
  },
  {
    filesCSS: 'styles/**/*.scss',
    outputCSSDir: config.outputDir + 'css',
    vendorCSS: [
      'node_modules/normalize.css/normalize.css',
      'vendor/prism.css'
    ],
    outputVendorCSS: 'vendor.css'
  },
  {
    filesIcons: 'res/*.svg',
    outputIconsDir: config.outputDir + 'res',
    iconColors: [['white', '#ffffff'], ['black', '#000000']]
  }
);

// TASKS

var vendorCSS = function() {
  return gulp
    .src(config.vendorCSS, { base: 'node_modules/' })
    .pipe(gulpif(!args.production, sourcemaps.init()))
    .pipe(postcss([csswring]))
    .pipe(concat(config.outputVendorCSS))
    .pipe(gulpif(!args.production, sourcemaps.write()))
    .pipe(gulp.dest(config.outputCSSDir));
};

var CSS = function() {
  var sassOpts = {
    sourcemap: !args.production,
    noCache: args.production,
    style: 'compressed'
  };
  var processors = [
    autoprefixer({ browsers: 'last 1 version' }),
    postcss_inline_svg({ path: './' }),
    postcss_svgo(),
    csswring()
  ];

  return gulp
    .src(config.filesCSS)
    .pipe(postcss([stylelint()], { syntax: postcss_scss }))
    .pipe(gulpif(!args.production, sourcemaps.init()))
    .pipe(sass(sassOpts))
    .pipe(gulpif(!args.production, sourcemaps.write()))
    .pipe(postcss(processors))
    .pipe(gulp.dest(config.outputCSSDir));
};

var vendorJS = function() {
  return gulp
      .src(config.vendorJS, { base: 'node_modules/' })
      .pipe(gulpif(!args.production, sourcemaps.init()))
      .pipe(concat(config.outputVendorJS))
      .pipe(uglify())
      .pipe(gulpif(!args.production, sourcemaps.write()))
      .pipe(gulp.dest(config.outputJSDir));
};

var bundler;
var getBundler = function() {
  if (!bundler) {
    bundler = watchify(browserify({
      entries: config.entryJS,
      extensions: ['.js'],
      debug: !args.production,
      cache: {},
      packageCache: {}
    }));
  }
  return bundler;
};

var lintJS = function() {
  return gulp
    .src(config.filesJS)
    .pipe(eslint())
    .pipe(eslint.format());
};

var buildJS = function() {
  var bundledStream = through();
  var log = function(err) {
    gutil.log(
      gutil.colors.red('Browserify compile error:'),
      err.message,
      gutil.colors.cyan('Line number:'),
      err.lineNumber
    );
  };

  bundledStream
    .pipe(source(config.outputJS))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.outputJSDir));

  globby([config.entryJS]).then(function(entries) {
    var b = browserify({
      entries: entries,
      debug: !args.production
    });

    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    bundledStream.emit('error', err);
  });

  return bundledStream;
};

var fallbackIcons = function() {
  var files = gulp.src(config.filesIcons);

  var streams = config.iconColors.map(function(colors) {
    var colorName = colors[0];
    var colorValue = colors[1];

    return files
      .pipe(clone())
      .pipe(cheerio(function($) {
        var svg = $('svg');
        var svgStyle = svg.attr('style');
        svg.attr('style', svgStyle + 'fill: ' + colorValue);
      }))
      .pipe(svg2png())
      .pipe(rename({ suffix: '-' + colorName }));
  });

  return es.merge.apply(this, streams).pipe(gulp.dest(config.outputIconsDir));
};

var clean = function() {
  return del(config.outputDir);
};

var terminate = function() {
  setTimeout(process.exit);
};

/**
 * Default task
 */
var defaultTask = function(cb) {
  return runSequence(
    'clean',
    ['vendorCSS', 'vendorJS'],
    ['CSS', 'lintJS'],
    ['buildJS', 'fallbackIcons'],
    cb
  );
};

var watchTask = function() {
  gulp.watch(config.filesCSS, ['CSS']);
  gulp.watch(config.vendorCSS, ['vendorCSS']);
  gulp.watch(config.vendorJS, ['vendorJS']);
  gulp.watch(config.filesIcons, ['fallbackIcons']);

  getBundler().on('update', function() {
    runSequence('lintJS', 'buildJS');
  });
};

/**
 * Exports tasks & watch
 */
gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('CSS', CSS);
gulp.task('lintJS', lintJS);
gulp.task('buildJS', buildJS);
gulp.task('JS', ['lintJS', 'buildJS'], terminate);
gulp.task('fallbackIcons', fallbackIcons);

gulp.task('clean', clean);
gulp.task('terminate', terminate);

gulp.task('defaultTask', defaultTask);
gulp.task('watchTask', watchTask);

gulp.task('default', function() {
  runSequence('defaultTask', 'terminate');
});
gulp.task('watch', function() {
  runSequence('defaultTask', 'watchTask');
});
