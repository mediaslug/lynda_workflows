// gulp variables
var gulp = require('gulp'),                   // assign all methods an properties of gulp to this variable
    gutil = require('gulp-util'),             // also create var for gulp-util
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngCrush = require('imagemin-pngcrush'),
    connect = require('gulp-connect'); 

// variables used throughout the script
var env,
    coffeeSources,
    jssources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

// declare the environment we're in.
env = process.env.NODE_ENV || 'production';

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
        .pipe(gulpif(env==='production', uglify()))
        .pipe(gulp.dest(outputDir +'js'))
        .pipe(connect.reload());
});


// compass task to process the scss (sass) files
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

// watch task to monitor files for changes
gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']); 
    gulp.watch(jsSources, ['js']); 
    gulp.watch('components/sass/*.scss', ['compass']); 
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch('builds/development/images/**/*.*', ['images']);

    gulp.watch(jsonSources, ['json']);

});

// connect task for handling server live reloads
gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
    
});

// html task
gulp.task('html', function(){
   gulp.src('builds/development/*.html')
       .pipe(gulpif(env==='production', minifyHTML()))
       .pipe(gulpif(env==='production', gulp.dest(outputDir)))
       .pipe(connect.reload());
});

// images task
gulp.task('images', function() {
    gulp.src('builds/development/images/**/*.*')
        .pipe(gulpif(env==='production', imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngCrush()]
        
        })))
        .pipe(gulpif(env==='production', gulp.dest(outputDir+'images')))
        .pipe(connect.reload());
    
});

// configure the json task
gulp.task('json', function(){
   gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env==='production', jsonminify()))
    .pipe(gulpif(env==='production', gulp.dest('builds/production/js')))
    .pipe(connect.reload());
});

// configure the default task and dependencies
gulp.task('default', ['coffee', 'js', 'html','json', 'compass', 'images', 'connect', 'watch']);