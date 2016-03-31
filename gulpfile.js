var gulp = require('gulp'),                   // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'),             // also create var for gulp-util
    coffee = require('gulp-coffee'); 

var coffeeSources = ['components/coffee/tagline.coffee'];


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