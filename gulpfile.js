const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const eslint = require('gulp-eslint');
const eslintIfFixed = require('gulp-eslint-if-fixed');
const config = require('./config.json');
 
gulp.task('lint_n_fix', () => {
    return gulp.src([config.files.srcJs,'!node_modules/**'])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslintIfFixed( file => (file.base)));
});
 
gulp.task('test', () =>
    gulp.src(config.files.specJs)
        .pipe(jasmine())
);

/** Watchers *************************************************************************************/
gulp.task('watch_n_fix', () => {
  gulp.watch(config.files.srcJs, ['lint_n_fix']);
});

gulp.task('watch_n_test', () => {
  gulp.watch(config.files.srcJs, ['test']);
});

gulp.task('watch_fix_n_test', () => {
  gulp.watch(config.files.srcJs, ['lint_n_fix', 'test']);
});
