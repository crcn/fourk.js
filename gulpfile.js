var gulp                  = require("gulp");
var istanbul              = require("gulp-istanbul");
var mocha                 = require("gulp-mocha");
var plumber               = require("gulp-plumber");
var jshint                = require("gulp-jshint");
var browserify            = require("browserify");
var uglify                = require("gulp-uglify");
var source                = require("vinyl-source-stream");
var buffer                = require("vinyl-buffer");
var jscs                  = require("gulp-jscs");
var jshint                = require("gulp-jshint");
var rename                = require("gulp-rename");
var coveralls             = require("gulp-coveralls");
var concat                = require("gulp-concat");
var karma                 = require("karma").server;
var options               = require("yargs").argv;

/**
 */

var paths = {
  testFiles : ["test/**/*-test.js", "./examples/**/*-test.js"],
  appFiles  : ["lib/**/*.js"],
  allFiles  : ["test/**", "lib/**", "examples/!(_static)/**"],
  watchFiles  : ["test/**", "lib/**"],
  lintFiles : ["test/**", "lib/**"],
};

/**
 */

var mochaOptions = {
  bail     : options.bail     !== 'false',
  reporter : options.reporter || 'dot',
  grep     : options.grep   || options.only
}

/**
 */

gulp.task("test-coverage", function (complete) {
  gulp.
  src(paths.appFiles).
  pipe(istanbul()).
  pipe(istanbul.hookRequire()).
  on("finish", function () {
    gulp.
    src(paths.testFiles).
    pipe(plumber()).
    pipe(mocha(mochaOptions)).
    pipe(istanbul.writeReports({
        reporters: ["text","text-summary", "lcov"]
    })).
    on("end", complete);
  });
});

/**
 */

gulp.task("test-coveralls", ["test-coverage"], function () {
  return gulp.
  src("coverage/**/lcov.info").
  pipe(coveralls());
});

/**
 */

gulp.task("bundle", function() {
  return browserify("./lib/index.js").
  bundle().
  pipe(source('caplet.js')).
  pipe(buffer()).
  pipe(gulp.dest('./dist'));
});

/**
 */

gulp.task("minify", ["bundle"], function() {
  return gulp.
  src("./dist/caplet.js").
  pipe(uglify()).
  pipe(rename(function(path) {
      path.basename += ".min";
  })).
  pipe(gulp.dest('./dist'));
});

/**
 */

 gulp.task("test-script", function(complete) {
   return browserify("./test/script-test.js").
   bundle().
   pipe(source("script.bundle.js")).
   pipe(buffer()).
   pipe(gulp.dest("./test"));
 });

/**
 */

gulp.task("test-browser", function(complete) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, complete);
});


/**
 */

gulp.task("lint", function() {
  return gulp.run(["jshint", "jscs"]);
});

/**
 */

gulp.task("jscs", function() {
  return gulp.
  src(paths.lintFiles).
  pipe(jscs({
    "preset": "google",
    "requireParenthesesAroundIIFE": true,
    "maximumLineLength": 120,
    "validateLineBreaks": "LF",
    "validateIndentation": 2,
    "validateQuoteMarks": "\"",

    "disallowKeywords": ["with"],
    "disallowSpacesInsideObjectBrackets": null,
    "disallowImplicitTypeConversion": ["string"],
    "requireCurlyBraces": [],

    "safeContextKeyword": "self"
  }));
});

gulp.task("less", function() {
  return gulp.
  src(paths.lessFiles).
  pipe(less()).
  pipe(concat("bundle.css")).
  pipe(gulp.dest("./examples/_static/css"));
});

/**
 */

gulp.task("jshint", function() {
    return gulp.
    src(paths.lintFiles).
    pipe(jshint()).
    pipe(jshint.reporter('default'));
});

/**
 */

gulp.task("test", function (complete) {
  gulp.
  src(paths.testFiles, { read: false }).
  pipe(plumber()).
  pipe(mocha(mochaOptions)).
  on("end", complete);
});

var iofwatch = process.argv.indexOf("watch");

/**
 * runs previous tasks (1 or more)
 */

gulp.task("watch", function () {
  gulp.watch(paths.allFiles, process.argv.slice(2, iofwatch));
});

/**
 */

gulp.task("default", function () {
  return gulp.run("test-coverage");
});

/**
 */

gulp.task("example", function (complete) {
  return browserify(__dirname + "/examples/" + (options.example || "default") + "/index.js", { extensions: [".jsx"],grep:/\.jsx$/,transform: [require("reactify")]}).
  bundle().
  pipe(source('bundle.js')).
  pipe(buffer()).
  pipe(gulp.dest('./examples/_static/js'));
});

/**
 */

gulp.doneCallback = function (err) {

  // a bit hacky, but fixes issue with testing where process
  // doesn't exist process. Also fixes case where timeout / interval are set (CC)
  if (!~iofwatch) process.exit(err ? 1 : 0);
};
