const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const gulpWebpack = require('webpack-stream');
const babel = require("gulp-babel");
const imagemin = require('gulp-imagemin');


//Function for img optimization(Now Basic Config)
function imgMin() {
    return gulp.src('src/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 6 })
        ], { verbose: true }))
        .pipe(gulp.dest('./build/images'));
}

// Function For compile LESS to CSS for production
function styles() {
    return gulp.src('./src/less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

// Function For compile LESS to CSS for development
function devStyles() {
    return gulp.src('./src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

// Function For compile JS for production
function scripts() {
    return gulp.src('./src/js/index.js')
        .pipe(gulpWebpack({
            mode: 'production',
            devtool: false,
            output: { filename: 'main.js' }
        }))
        .pipe(babel())
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

// Function For compile JS for development
function devScripts() {
    return gulp.src('./src/js/index.js')
        .pipe(gulpWebpack({
            mode: 'development',
            devtool: 'eval-sourcemap',
            output: { filename: 'main.js' }
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}


//Function for watching for changes and reload browsers
function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        browser: "firefox developer edition"
    });

    // gulp.watch('./*.html', browserSync.reload);
    gulp.watch('./src/less/**/*.less', devStyles);
    gulp.watch('./src/js/**/*.js', devScripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

//Function for cleaning build directory before build or devBuild
function clean() {
    return del(['build/*']);
}


gulp.task('styles', styles);
gulp.task('devStyles', devStyles);
gulp.task('scripts', scripts);
gulp.task('devScripts', devScripts);
gulp.task('watch', watch);
gulp.task('imgMin', imgMin);

gulp.task('build', gulp.series(clean,
                    gulp.parallel(styles, scripts)
));
gulp.task('devBuild', gulp.series(clean,
                        gulp.parallel(devStyles, devScripts)
));

gulp.task('dev', gulp.series('devBuild', 'watch'));