var gulp = require('gulp'), // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'); // also create var for gulp-util

// create a task by using the task method
gulp.task('log', function() { // define the log task
    gutil.log('workflows are awesome')
});