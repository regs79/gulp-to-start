var	gulp = require('gulp');
  browserSync = require('browser-sync').create();
	sass = require('gulp-sass');
	normalize = require('node-normalize-scss').includePaths;
	neat = require('node-neat').includePaths;
	fileinclude = require('gulp-file-include');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss') // Location of working Sass files
  	.pipe(sass({
  		includePaths: [].concat(normalize, neat),
  		//outputStyle: 'compressed'
  	})) // Convert Sass to CSS
  	.pipe(gulp.dest('app/css')) // Location of final CSS
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('fileinclude', function() {
  gulp.src(['app/includes/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('watch', ['browserSync', 'sass', 'fileinclude'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/templates/**/*.html', ['fileinclude']);
  gulp.watch('app/templates/**/*.templ', ['fileinclude']);
  // Other watchers
})