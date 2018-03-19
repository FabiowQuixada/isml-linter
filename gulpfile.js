const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const eslint = require('gulp-eslint');
const eslintIfFixed = require('gulp-eslint-if-fixed');
const istanbul = require('gulp-istanbul');
const reqlib = require('app-root-path').require;
const run = require('gulp-run');
const Constants = reqlib('/src/app/Constants');
const config = reqlib('/config.json');

const ismlRegex = config.rootTemplateDir + '**/*.isml';
 
gulp.task('lint_n_fix', () => {
    return gulp.src([Constants.srcJsRegex,'!node_modules/**', `!${Constants.specTempDir}`])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslintIfFixed( file => (file.base)));
});
 
gulp.task('test', () =>
    gulp.src(Constants.specJsRegex)
        .pipe(jasmine())
);

gulp.task('pre-cover', () => 
    gulp.src(Constants.srcJsRegex)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
);

gulp.task('cover', ['pre-cover'], () => 
    gulp.src(Constants.srcJsRegex)
        .pipe(jasmine())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
);

gulp.task('lint_isml', () => run('npm start').exec() );

/** Watchers *************************************************************************************/
gulp.task('watch_n_fix', () => {
  gulp.watch(Constants.srcJsRegex, ['lint_n_fix']);
});

gulp.task('watch_n_cover', () => {
  gulp.watch(Constants.srcJsRegex, ['cover']);
});

gulp.task('watch_n_test', () => {
  gulp.watch(Constants.srcJsRegex, ['test']);
});

gulp.task('watch_fix_n_test', () => {
  gulp.watch(Constants.srcJsRegex, ['lint_n_fix', 'test']);
});

gulp.task('watch_isml', () => {
  gulp.watch(ismlRegex, ['lint_isml']);
});
