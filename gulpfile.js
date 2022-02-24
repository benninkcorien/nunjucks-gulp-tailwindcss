// gulpfile.js
const run = require("gulp-run-command").default;
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const nunjucksRender = require("gulp-nunjucks-render");
const version = require("gulp-version-number");
const sass = require("gulp-sass")(require("sass"));
const PATHS = {
  output: "dist",
  srcpath: "src",
  templates: "src/templates",
  pages: "src/pages",
};
const versionConfig = {
  value: "%MDS%",
  append: {
    key: "v",
    to: ["css", "js"],
  },
};

// Convert Nunjucks files to HTML
// This also regenerates the TailwindCSS
gulp.task("nun", function () {
  return gulp
    .src(PATHS.pages + "/**/*.+(html|njk)")
    .pipe(
      nunjucksRender({
        path: [PATHS.templates],
        watch: true,
      })
    )
    .pipe(version(versionConfig))
    .pipe(gulp.dest(PATHS.output));
});

gulp.task("sync", function () {
  browserSync.init({
    server: {
      baseDir: PATHS.output,
    },
  });
});

gulp.task("watch", function () {
  // trigger Nunjucks render when pages or templates changes
  // File support for .html .njk .js .css
  gulp.watch(
    [PATHS.pages + "/**/*.+(njk)", PATHS.templates + "/**/*.+(njk)"],
    gulp.series("tailwind", "nun")
  );
  gulp.watch([PATHS.srcpath + "/sass/*.sass"], gulp.series("sass"));
  // reload browsersync when `dist` changes
  gulp.watch([PATHS.output + "/**/*.*"]).on("change", browserSync.reload);
});

gulp.task("tailwind", run("yarn run build"));

gulp.task("minify", function () {
  return gulp
    .src(PATHS.output + "/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        cssmin: true,
        jsmin: true,
        removeOptionalTags: true,
        removeComments: false,
      })
    )
    .pipe(gulp.dest(PATHS.output));
});

// Compile custom SASS into CSS
gulp.task("sass", function () {
  return gulp
    .src(PATHS.srcpath + "/sass/*.sass")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(gulp.dest(PATHS.output + "/assets/css"));
});

// run browserSync auto-reload together with nunjucks auto-render
gulp.task(
  "auto",
  gulp.series(gulp.parallel("sync", "watch"), function () {})
);

//default task just runs "convert nunjucks files to html"
gulp.task("default", gulp.series("tailwind", "nun"), function () {});
