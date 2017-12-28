const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const util = require('gulp-util');
const pump = require('pump');
const gulpSequence = require('gulp-sequence');
const clean = require('gulp-clean');
const inlinesource = require('gulp-inline-source');
const concat = require('gulp-concat');
const svgmin = require('gulp-svgmin');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const htmlmin = require('gulp-html-minifier');

const config = {
  scssSrc: 'src/*.scss',
  jsSrc: 'src/*.js',
  src: 'src/',
  dest: 'dest/',
  htmlSrc: 'src/index.html',
  assets: ['src/manifest.json', 'src/robots.txt'],
  images: ['src/assets/*'],
  imagesDest: 'dest/assets',
  prodJsSrc: ['src/vendor/analytics.js'],
  production: !!util.env.production // --production
};

gulp.task('serve', ['sass', 'scripts', 'copy-static'], () => {
  browserSync.init({
    server: config.dest
  });
  gulp.watch(config.scssSrc, ['sass']).on('change', browserSync.reload);
  gulp.watch(config.jsSrc, ['scripts']).on('change', browserSync.reload);
  gulp.watch(config.htmlSrc, ['copy-static']).on('change', browserSync.reload);
  gulp.watch('src/assets/*', ['copy-static']).on('change', browserSync.reload);
});

gulp.task('scripts', cb => {
  const allScripts = config.production ? [config.jsSrc, ...config.prodJsSrc] : config.jsSrc;
  pump(
    [
      gulp.src(allScripts),
      concat('scripts.js'),
      config.production ? babel({ presets: ['es2015'] }) : util.noop(),
      config.production
        ? uglify().on('error', e => {
            console.log(e);
          })
        : util.noop(),
      gulp.dest(config.dest)
    ],
    cb
  );
});

gulp.task('images', () => {
  return gulp
    .src(config.images)
    .pipe(svgmin())
    .pipe(config.production ? rev() : util.noop())
    .pipe(gulp.dest(config.imagesDest))
    .pipe(config.production ? rev.manifest() : util.noop())
    .pipe(config.production ? gulp.dest(config.imagesDest) : util.noop())
});

gulp.task('copy-static', ['images', 'sass'], () => {
  gulp.src(config.assets).pipe(gulp.dest(config.dest));

  return gulp
    .src(config.htmlSrc)
    .pipe(config.production ? inlinesource({ rootpath: config.dest }) : util.noop())
    .pipe(config.production ? htmlmin({collapseWhitespace: true}) : util.noop())
    .pipe(gulp.dest(config.dest));
});

gulp.task('sass', ['images'],  () => {
  var manifestPath = gulp.src(config.imagesDest + '/rev-manifest.json');
  return gulp
    .src(config.scssSrc)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      config.production
        ? autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          })
        : util.noop()
    )
    .pipe(config.production ? revReplace({manifest: manifestPath}) : util.noop())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});

gulp.task('cleanup', cb => {
  return gulp.src(config.dest + '*').pipe(clean());
});

gulp.task('build', gulpSequence('cleanup', 'images',  ['sass', 'scripts'], 'copy-static'));
gulp.task('default', ['serve']);
