var gulp = require('gulp'),                   // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'),             // also create var for gulp-util
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'); 

var env,
    coffeeSources,
    jssources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir= 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];

jsSources = ['components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

sassSources= ['components/sass/style.scss'];
htmlSources = [outputDir +'*.html'];
jsonSources = [outputDir +'js/*.json'];


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
        .pipe(gulp.dest(outputDir +'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle})
        .on('error', gutil.log))
        .pipe(gulp.dest(outputDir +'/css/'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']); 
    gulp.watch(jsSources, ['js']); 
    gulp.watch('components/sass/*.scss', ['compass']); 
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);

});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
    
});

gulp.task('html', function(){
   gulp.src(htmlSources)
   .pipe(connect.reload());
});

gulp.task('json', function(){
   gulp.src(jsonSources)
   .pipe(connect.reload());
});




gulp.task('default', ['coffee', 'js', 'html','json', 'compass', 'connect', 'watch']);