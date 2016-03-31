var gulp = require('gulp'),                   // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'),             // also create var for gulp-util
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'); 

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = ['components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];


// create a task by using the task method
gulp.task('log', function() { // define the log task
    gutil.log('workflows are awesome')
});

gulp.task('coffee', function() { // define the coffee task
    gulp.src(coffeeSources)
        .pipe(coffee({bare:true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'));
});