// gulpfile.js

const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const extReplace = require("gulp-ext-replace");
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const imageResize = require("gulp-image-resize");
const nunjucksRender = require("gulp-nunjucks-render");
const rename = require("gulp-rename");
const run = require("gulp-run-command").default;
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const version = require("gulp-version-number");
const webp = require("imagemin-webp");

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

// BrowserSync
gulp.task("sync", function () {
  browserSync.init({
    server: {
      baseDir: PATHS.output,
    },
  });
});

// Watch for Changes
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

// Build TailwindCSS file
gulp.task("tailwind", run("yarn run build"));

// Compile custom SASS into CSS
gulp.task("sass", function () {
  return gulp
    .src(PATHS.srcpath + "/sass/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(PATHS.output + "/assets/css"));
});

// MinifyCSS
gulp.task("minifycss", () => {
  return gulp
    .src(PATHS.output + "/assets/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(extReplace(".min.css"))
    .pipe(gulp.dest(PATHS.output + "/assets/css/"));
});

// Minify HTML
gulp.task("minifyhtml", function () {
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

// Generate Image sizes
gulp.task("resizeimages", function images(cb) {
  [325, 500, 768, 1024].forEach(function (size) {
    gulp
      .src(PATHS.output + "/images/convert/*.{jpg,jpeg,png}")
      .pipe(imageResize({ width: size }))
      .pipe(
        rename(function (path) {
          path.basename = `${path.basename}-${size}`;
        })
      )
      .pipe(imagemin())
      .pipe(gulp.dest(PATHS.output + "/images"));
  });
  cb();
});

// Minify Images
gulp.task("minifyimages", async function () {
  gulp
    .src(PATHS.output + "/images/convert/*.{jpg,jpeg,png}")
    .pipe(
      imagemin({
        verbose: true,
      })
    )
    .pipe(gulp.dest(PATHS.output + "/images/smaller"));
});

// Convert images to Webp
gulp.task("convertimages", async function () {
  let src = PATHS.output + "/images/convert/*.+(png|jpg|jpeg)";
  let dest = PATHS.output + "/images/webp/";

  return gulp
    .src(src)
    .pipe(
      imagemin({
        verbose: true,
        plugins: webp({ quality: 96, alphaQuality: 100 }),
      })
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(dest));
});

// watch for changes and live reload to reflect those changes
gulp.task(
  "auto",
  gulp.series(gulp.parallel("sync", "watch"), function () {})
);

//default task generates TailwindCSS files and converts nunjucks templates to html
gulp.task("default", gulp.series("tailwind", "nun"), function () {});
