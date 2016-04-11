var gulp = require('gulp'),                   // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'),             // also create var for gulp-util
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'); 

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = ['components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

var sassSources= ['components/sass/style.scss'];


// create tasks by using the task method
gulp.task('log', function() { // define the log task which will execute an anonymous function/a callback
    gutil.log('workflows are awesome')
});

gulp.task('coffee', function() { // define the coffee task
    gulp.src(coffeeSources)
        .pipe(coffee({bare:true}) // compiles the javascript w/o putting it in a safety wrapper
        .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', ['coffee'],function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'})
        .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css/'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']); 
    gulp.watch(jsSources, ['js']); 
    gulp.watch('components/sass/*.scss', ['compass']); 

});

gulp.task('connect', function() {
    connect.server({
        root: 'builds/development',
        livereload: true
    });
    
});




gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);