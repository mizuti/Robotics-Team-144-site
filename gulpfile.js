'use strict';

var browserSync = require('browser-sync').create(),
    path = require('path'),
    del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    handlebars = require('gulp-compile-handlebars'),
    header = require('gulp-header'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    templateData = require('./template-data');


/************************************************************************************/
// Compile handlebars templates
gulp.task('handlebars', function() {
    return gulp.src('pages/*.handlebars')
        .pipe(handlebars(templateData, {
            ignorePartials: true,
            partials: {
            },
            batch: ['./components'],
            helpers: {
                capitals: function(str){
                    return str.toUpperCase();
                }
            }
        }))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'))
});
/************************************************************************************/



// Task to compile SCSS
gulp.task('sass', function () {
    return gulp.src('./scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'nested',
        errLogToConsole: false,
        paths: [path.join(__dirname, 'scss', 'includes')]
      })
        .on("error", notify.onError(function (error) {
          return "Failed to Compile SCSS: " + error.message;
        })))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css/'))
      .pipe(browserSync.stream())
      .pipe(notify({
        message: "SCSS Compiled Successfully :)",
        onLast: true
      }));
});

// Gulp Clean Up Task
gulp.task('clean', function () {
  return del('dist/css/');
});

// // Minify compiled CSS
// gulp.task('minify-css', ['sass'], function() {
//     return gulp.src('css/main.css')
//         .pipe(cleanCSS({ compatibility: 'ie8' }))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('dist/css'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });



// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/vendor/jquery'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('dist/vendor/font-awesome'))
    
    gulp.src([
        '.htaccess',
        'robots.txt',
        'humans.txt',
        'favicon.ico',
        'icon.png',
        'tile-wide.png',
        'tile.png',
        '404.html',
        'browserconfig.xml'
    ])
    .pipe(gulp.dest('dist/'))
})


// Run everything
gulp.task('default', ['clean', 'sass', 'minify-js', 'handlebars', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync','clean', 'sass', 'handlebars', 'minify-js'], function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    gulp.watch('**/*.handlebars', ['handlebars']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/css/*.css', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});
