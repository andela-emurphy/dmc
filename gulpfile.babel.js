import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import path from 'path';

const paths = {
  es6: './es6/**',
  es5: './es5',
  sourceRoot: path.join(__dirname, 'es6'),
};


gulp.task('babel', () => {
  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
    .pipe(gulp.dest(paths.es5));
});

gulp.task('watch', ['babel'], () => {
  gulp.watch(paths.es6, ['babel']);
});


gulp.task('default', ['watch']);
