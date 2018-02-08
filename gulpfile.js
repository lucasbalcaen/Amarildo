/**
 * Created by lucas on 20/06/2016.
 */

'use strict';

var gulp = require('gulp');

//

var changed = require('gulp-changed');
var runSequence = require('run-sequence');
var minifycss = require("gulp-minify-css");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate');

var del = require('del');
//

var paths = {
    style: 'src/main/application/style',
    src: './src/main/',
    dist: 'app',
    style_dist: 'app/application/assets/style',
    libs: 'bower_components'
};

gulp.task('default', function (next) {
    runSequence(
        'clean',
        'build',
        ['watch'],
        next
    );

});

gulp.task('clean', function (next) {
    del(paths.dist, next);
});

gulp.task('delete:main', function (next) {
    del(paths.dist + '/main.js', next);
});

gulp.task('build', function (next) {

    runSequence(
        'copy:html',
        'copy:libs',
        'copy:data',
        'copy:img',
        'copy:icons',
        'copy:favicons',
        'browserify',
        'compile:sass',
        'compile:js',
        next
    );

});

gulp.task('buildcss', function (next) {
    runSequence(
        'compile:sass',
        next
    );
});

gulp.task('compile', function (next) {

    runSequence(
        'build',
        'uglify',
        'delete:main',
        next
    );

});

gulp.task('compileToRoot', function (next) {
    var old = paths.dist;
    var oldStyle = paths.style_dist;
    paths.style_dist = './application/assets/style';
    paths.dist = '.';
    runSequence(
        'compile',
        next
    );
});

gulp.task('compileWithoutLibs', function (next) {

    runSequence(
        'copy:html',
        'copy:data',
        'copy:img',
        'copy:fonts',
        'browserify',
        'compile:sass',
        'uglify',
        next
    );

});

gulp.task('watch', [
    'watch:js',
    'watch:sass',
    'watch:html'
    //'watch:test'
]);

gulp.task('copy:icons', function (next) {
    return gulp.src([paths.src + '/**/*.svg'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('copy:favicons', function (next) {
    return gulp.src([paths.src + '/**/*.*'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('copy:img', function (next) {
    return gulp.src([paths.src + '/**/*.png', paths.src + '/**/*.jpg', paths.src + '/**/*.jpeg',paths.src + '/**/*.svg'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('copy:data', function (next) {
    return gulp.src([paths.src + '/**/*.json'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('copy:fonts', function (next) {
    return gulp.src([paths.src + '/**/*.otf'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist))
});



gulp.task('watch:js', function () {
    gulp.watch([paths.src + '/**/*.js'], ['compile:js']);
    //gulp.watch([paths.src + '/**/*.js'], ['browserify']);

});

gulp.task('watch:html', function () {
    gulp.watch([paths.src + '/**/*.html', paths.src + '/index.html'], ['copy:html']);
});

gulp.task('watch:sass', function () {

    gulp.watch([paths.style + '/**/*.scss'], ['compile:sass']);

});

gulp.task('watch:test', function () {

    gulp.watch(paths.test + '/**/*.ts', ['compile:test']);

});

gulp.task("compile:sass", function () {

    gulp.src(paths.style + "/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(paths.style_dist))
        .pipe(rename({suffix: ".min"}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.style_dist));
    return gulp.src(paths.style + "/print.scss")
        .pipe(sass())
        .pipe(gulp.dest(paths.style_dist))
        .pipe(rename({suffix: ".min"}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.style_dist));
});

gulp.task('compile:js', function () {

    gulp.src(paths.src + '/**/*.js')
        .pipe(changed(paths.dist));

    return runSequence(
        'browserify'
    );
});

gulp.task('browserify', function () {

    return gulp.src(paths.src + '/main.js', {read: false})
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        .pipe(ngAnnotate())
        .pipe(rename('/main.js'))
        .pipe(gulp.dest(paths.dist));

});

gulp.task('uglify', function () {

    return gulp.src(paths.dist + '/main.js')
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename('build.min.js'))
        .pipe(gulp.dest(paths.dist + '/'));

});

gulp.task('copy:html', function () {

    return gulp.src([paths.src + '/**/*.html', paths.src + '/index.html'])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist));

});

//gulp.task('copy:data', function () {
//
//    return gulp.src("data/**/*.*")
//        .pipe(gulp.dest(paths.dist+'/data/'));
//
//});
//
gulp.task('copy:libs', function () {

    return gulp.src([
            paths.libs + '/**/*.*',
            '!' + paths.libs + '/angular/**/*.*',
            '!' + paths.libs + '/angular-route/**/*.*',
            '!' + paths.libs + '/angular-animate/**/*.*',
            '!' + paths.libs + '/angular-i18n/**/*.*',
            '!' + paths.libs + '/angular-touch/**/*.*',
            '!' + paths.libs + '/angular-x2js/**/*.*'
        ])
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist + "/bower_components/"));

});