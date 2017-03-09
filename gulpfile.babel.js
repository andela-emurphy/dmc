import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import path from 'path';
import nodemon from 'gulp-nodemon';

const paths = {
  server: './server/**',
  client: './client',
  es5: './dist',
  sourceRoot: path.join(__dirname, 'dist'),
  test: './test/**',
  eslint: ['server/**/*.js', 'client/**/*.js', 'test/**/**/*.js']
};


gulp.task('lint', () => gulp.src(paths.eslint)
    .pipe(eslint())
    .pipe(eslint.format()));

gulp.task('babel:server', () => gulp.src(paths.server)
    .pipe(babel())
    .pipe(gulp.dest(`${paths.es5}`)));

gulp.task('babel:test', () => gulp.src(paths.test)
    .pipe(babel())
    .pipe(gulp.dest(`${paths.sourceRoot}/test`)));

gulp.task('babel', ['babel:test', 'babel:server']);

gulp.task('watch', () => gulp
  .watch(paths.es5, ['babel', 'test']));

gulp.task('test:server', ['babel'], () => gulp
    .src('es5/test/server/**/*.js')
    .pipe(mocha({ reporter: 'nyan' })));

gulp.task('start', ['babel'], () => nodemon({
  script: `${paths.sourceRoot}/server.js`,
  ext: 'js html',
  ignore: [`${paths.es5}`],
  env: { NODE_ENV: 'development' },
  tasks: ['babel']
}));

gulp.task('test', ['test:server'], () => gulp
  .watch('./test/**/**', ['test:server']));

gulp.task('default', ['babel', 'watch']);
