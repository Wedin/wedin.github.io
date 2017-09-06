const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const prettier = require('gulp-nf-prettier');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const util = require('gulp-util');
const pump = require('pump');
const gulpSequence = require('gulp-sequence');
const clean = require('gulp-clean');
const inlinesource = require('gulp-inline-source');
const concat = require('gulp-concat');
const svgmin = require('gulp-svgmin');

const config = {
  scssSrc: 'src/*.scss',
  jsSrc: 'src/*.js',
  src: 'src/',
  dest: 'dest/',
  htmlSrc: 'src/index.html',
  assets: ['src/manifest.json'],
  images: ['src/assets/*'],
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

gulp.task('scripts', ['prettier'], cb => {
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

gulp.task('prettier', () => {
  if (config.production) {
    return;
  }
  gulp
    .src(config.jsSrc)
    .pipe(
      prettier({
        printWidth: 125,
        tabWidth: 2,
        parser: 'flow',
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: true
      })
    )
    .pipe(gulp.dest(config.src));
});

gulp.task('images', () => {
  gulp
    .src(config.images)
    .pipe(svgmin())
    .pipe(gulp.dest(`${config.dest}/assets`));
});

gulp.task('copy-static', ['images'], () => {
  gulp
    .src(config.htmlSrc)
    .pipe(config.production ? inlinesource({ rootpath: config.dest }) : util.noop())
    .pipe(gulp.dest(config.dest));
  gulp.src(config.assets).pipe(gulp.dest(config.dest));
});

gulp.task('sass', () => {
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
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});

gulp.task('cleanup', cb => {
  return gulp.src(config.dest + '*').pipe(clean());
});

gulp.task('build', gulpSequence('cleanup', ['sass', 'scripts'], 'copy-static'));
gulp.task('default', ['serve']);
