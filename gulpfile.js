'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      plumber = require('gulp-plumber'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync'),
      pug = require('gulp-pug'),
      rename = require('gulp-rename'),
      pugPHPFilter = require('pug-php-filter');

// sass
gulp.task('sass', () => {
  gulp.watch('./scss/**/*.scss', () => {
  // scssファイルからcssファイルを書き出し
  return gulp.src('./scss/style.scss')
    .pipe(sourcemaps.init()) //ソースマップ出力のための初期準備
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./map')) //ソースマップを出力する
    .pipe(gulp.dest('./css'));
  });
});

//autoprefixer
gulp.task('autoprefixer', () => {
  return gulp.src('./css/style.css')
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 4 versions', 'ie >= 11', 'iOS >= 8' , 'Android >= 4'],
        cascade: false
      })
    ]))
  .pipe(gulp.dest('./css'));
});

//pug
gulp.task('pug', () => {
  let option = {
		pretty: true,
		filters: {
			php: pugPHPFilter
		}
	}
  return gulp
    .src(['pug/**/*.pug','!pug/**/_*.pug'])
    .pipe(pug(option))
    .pipe(rename({
      extname: '.php'
    }))
   .pipe( gulp.dest( './' ) );
});

//ファイルに変更があったらする処理諸々
gulp.task('watch', () => {
  // scssファイルが変更されたらsassタスクを実行
  gulp.watch('./scss/**/*.scss', gulp.task('sass'));
  gulp.watch('./scss/**/*.scss', gulp.task('autoprefixer'));
  // pugファイルが変更されたらpugタスクを実行
  gulp.watch([ 'pug/**/*.pug', '!pug/**/_*.pug' ], gulp.task('pug'));
  // phpファイルとcssファイルが変更されたら、ブラウザをリロード
  gulp.watch(['./*.html', './*.php', './css/*.css', './js/*.js']).on('change', browserSync.reload);
});

gulp.task('serve', () => {
  // WordPress開発環境と連携のためプロキシを使用
  browserSync.init({
      proxy: 'localhost/projectFolder/'
  });
});

gulp.task('default', gulp.parallel('serve', 'watch'));