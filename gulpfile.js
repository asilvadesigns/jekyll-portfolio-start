//
//  Helpful Resources:
//  https://github.com/shakyShane/jekyll-gulp-sass-browser-sync
//  http://blog.webbb.be/use-jekyll-with-gulp/
//
//
//  Required Plugins
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    cssnano      = require('gulp-cssnano'),
    childProcess = require('child_process'),
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    sassdoc      = require('sassdoc'),
    uglify       = require('gulp-uglify');

//
//  Messages
var messages     = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

//
//  Jekyll Build
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return childProcess.spawn('jekyll.bat', ['build', '--profile'], {stdio: 'inherit'})
        .on('close', done);
});

//
//  Jekyll Rebuild
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

//
//  Jekyll Serve
gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-build'], function() {
    browserSync.init({
        server: '_site',
        notify: true
    });
});

//
//  Javascript
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./_includes'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//
//  Sass Compile
gulp.task('sass', function() {
    gulp.src('./_sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers:  ['last 2 versions'],
            cascade:   false
        }))
        .pipe(cssnano({
            discardComments: { removeAll: true }
        }))
        .pipe(gulp.dest('./_includes'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//
//  Sass Docs
gulp.task('sassdoc', function() {
    gulp.src('./_sass/**/*.scss')
        .pipe(sassdoc({
            dest: './_docs',
        }))
});

//
//  Watch
gulp.task('watch', function () {
    gulp.watch('./_sass/**/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['scripts']);
    gulp.watch(['./_includes/*', './_layouts/*', './_pages/*', './_posts/*', './_projects/*'], ['jekyll-rebuild']);
});

//
//  Production
gulp.task('production', ['sass', 'sassdoc', 'scripts', 'jekyll-build']);

//
//  Default
gulp.task('default', ['browser-sync', 'watch']);
