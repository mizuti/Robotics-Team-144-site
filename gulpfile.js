var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

/************************************************************************************/
// Compile handlebars templates
gulp.task('handlebars', function() {
    var templateData = {
            placeholder: {
                medium: 'https://placehold.it/450x350'
            },
            sponsors: [
                "Clippard",
                "P&G",
                "Skyline"
            ],
            bannerGallery: [
                'https://placehold.it/450x350',
                'https://placehold.it/450x350',
                'https://placehold.it/450x350',
                'https://placehold.it/450x350',
            ]
        },
        options = {
            ignorePartials: true,
            partials: {
            },
            batch: ['./partials'],
            helpers: {
                capitals: function(str){
                    return str.toUpperCase();
                }
            }
        }
    return gulp.src('pages/*.handlebars')
        .pipe(handlebars(templateData, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'))
});
/************************************************************************************/



// Compile SCSS files from /scss into /css
gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
        .pipe(sass())
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});



// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('dist/vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/vendor/jquery'))

    gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('dist/vendor/magnific-popup'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('dist/vendor/scrollreveal'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('dist/vendor/font-awesome'))
})


// Run everything
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'handlebars', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'handlebars', 'minify-js'], function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    gulp.watch('**/*.handlebars', ['handlebars']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/css/*.css', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});
