/* eslint-env node */

var gulp = require('gulp');

// JS
var eslint = require('gulp-eslint');
var browserify = require('browserify');

// CSS
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var stylelint = require('stylelint');
var csswring = require('csswring');

var postcssInlineSvg = require('postcss-inline-svg');
var postcssSvgo = require('postcss-svgo');

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
      'vendor/simple-scrollbar/simple-scrollbar.min.js',
      'vendor/prism.js'
    ],
    fallbackJS: [
      'node_modules/classlist-polyfill/src/index.js',
      'node_modules/custom-event-polyfill/custom-event-polyfill.js'
    ],
    outputVendorJS: 'vendor.js',
    outputFallbackJS: 'fallback.js'
  },
  {
    filesCSS: 'styles/**/*.scss',
    outputCSSDir: config.outputDir + 'css',
    vendorCSS: [
      'node_modules/normalize.css/normalize.css',
      'vendor/simple-scrollbar/simple-scrollbar.css',
      'vendor/prism.css'
    ],
    outputVendorCSS: 'vendor.css'
  },
  {
    filesIcons: 'res/*.svg',
    outputIconsDir: config.outputDir + 'res',
    iconColors: [['white', '#ffffff'], ['black', '#000000']],
    concurrentIcons: 3
  },
  {
    fonts: 'fonts/*',
    outputFonts: 'assets/fonts/'
  }
);

// ERROR HANDLERS

var Error = {
  css: function(err) {
    console.log(err);
    this.emit('end');
  },
  js: function(err) {
    gutil.log(
      gutil.colors.red('Browserify compile error:'),
      err.message,
      gutil.colors.cyan('Line number:'),
      err.lineNumber
    );
  }
};

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
    postcssInlineSvg({ path: './' }),
    postcssSvgo(),
    csswring()
  ];

  return gulp
    .src(config.filesCSS)
    .pipe(gulpif(!args.production, sourcemaps.init()))
    .pipe(postcss([stylelint()], { syntax: require('postcss-scss') }))
    .pipe(sass(sassOpts).on('error', Error.css))
    .pipe(postcss(processors))
    .pipe(gulpif(!args.production, sourcemaps.write('./')))
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

var lintJS = function() {
  return gulp
    .src(config.filesJS)
    .pipe(eslint())
    .pipe(eslint.format());
};

var buildJS = function() {
  var bundledStream = through();

  bundledStream
    .pipe(source(config.outputJS))
    .pipe(buffer())
    .pipe(gulpif(!args.production, sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(args.production, uglify()))
    .on('error', Error.js)
    .pipe(gulpif(!args.production, sourcemaps.write('./')))
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

var fallbackJS = function() {
  return gulp
    .src(config.fallbackJS, { base: 'node_modules/' })
    .pipe(gulpif(!args.production, sourcemaps.init()))
    .pipe(concat(config.outputFallbackJS))
    .pipe(gulpif(args.production, uglify()))
    .pipe(gulpif(!args.production, sourcemaps.write()))
    .pipe(gulp.dest(config.outputJSDir));
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
        svg.attr('style', svgStyle + 'fill: ' + colorValue + ';color: ' + colorValue + ';');
      }))
      .pipe(svg2png({}, false, config.concurrentIcons))
      .pipe(rename({ suffix: '-' + colorName }));
  });

  return es.merge.apply(this, streams).pipe(gulp.dest(config.outputIconsDir));
};

var fonts = function() {
  return gulp.src(config.fonts)
    .pipe(gulp.dest(config.outputFonts));
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
    ['buildJS', 'fallbackJS', 'fallbackIcons', 'fonts'],
    cb
  );
};

var watchTask = function() {
  gulp.watch(config.filesCSS, ['CSS']);
  gulp.watch(config.vendorCSS, ['vendorCSS']);
  gulp.watch(config.vendorJS, ['vendorJS']);
  gulp.watch(config.filesJS, ['JS']);
  gulp.watch(config.fonts, ['fonts']);
  gulp.watch(config.fallbackJS, ['fallbackJS']);
  gulp.watch(config.filesIcons, ['fallbackIcons']);
};

/**
 * Exports tasks & watch
 */
gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('CSS', CSS);
gulp.task('lintJS', lintJS);
gulp.task('buildJS', buildJS);
gulp.task('fallbackJS', fallbackJS);
gulp.task('JS', ['lintJS', 'buildJS', 'fallbackJS']);
gulp.task('fallbackIcons', fallbackIcons);
gulp.task('fonts', fonts);

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
