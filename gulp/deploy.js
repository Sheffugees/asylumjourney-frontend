'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});

gulp.task('gh-pages', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

gulp.task('deploy', ['gh-pages']);
