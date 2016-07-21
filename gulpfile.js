var	gulp = require('gulp');
  browserSync = require('browser-sync').create();
  reload = browserSync.reload;
	sass = require('gulp-sass');
	normalize = require('node-normalize-scss').includePaths;
	neat = require('node-neat').includePaths;
  cssnano = require('gulp-cssnano');
  imagemin = require('gulp-imagemin');
  runSequence = require('run-sequence');
  nunjucksRender = require('gulp-nunjucks-render');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    },
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
  	.pipe(sass({
  		includePaths: [].concat(normalize, neat),
  		outputStyle: 'compressed'
  	}))
    .pipe(cssnano())
  	.pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
})

gulp.task('nunjucks', function () {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['browserSync', 'sass', 'nunjucks', 'images'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/images/**/*.+(png|jpg|gif|svg)', ['images']);
  gulp.watch('app/pages/**/*.nunjucks', ['nunjucks']);
  gulp.watch('app/templates/**/*.nunjucks', ['nunjucks']);
  gulp.watch("dist/*.html").on('change', reload);
})

gulp.task('build', function (callback) {
  runSequence('sass', 
    ['nunjucks', 'images'],
    callback
  )
})