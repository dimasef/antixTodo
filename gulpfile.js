let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    return gulp.src(['sass/**/*.sass', 'sass/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('map'))
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
    gulp.watch(['sass/**/*.sass', 'sass/**/*.scss'], ['sass']);
});

gulp.task('default', ['watch']);