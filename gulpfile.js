const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const eslint = require('gulp-eslint');
const eslintIfFixed = require('gulp-eslint-if-fixed');
const istanbul = require('gulp-istanbul');
const config = require('./config.json');
 
gulp.task('lint_n_fix', () => {
    return gulp.src([config.regex.srcJs,'!node_modules/**'])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslintIfFixed( file => (file.base)));
});
 
gulp.task('test', () =>
    gulp.src(config.regex.specJs)
        .pipe(jasmine())
);

gulp.task('pre-cover', () => 
    gulp.src(config.regex.srcJs)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
);

gulp.task('cover', ['pre-cover'], () => 
    gulp.src(config.regex.srcJs)
        .pipe(jasmine())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
);


/** Watchers *************************************************************************************/
gulp.task('watch_n_fix', () => {
  gulp.watch(config.regex.srcJs, ['lint_n_fix']);
});

gulp.task('watch_n_cover', () => {
  gulp.watch(config.regex.srcJs, ['cover']);
});

gulp.task('watch_n_test', () => {
  gulp.watch(config.regex.srcJs, ['test']);
});

gulp.task('watch_fix_n_test', () => {
  gulp.watch(config.regex.srcJs, ['lint_n_fix', 'test']);
});
