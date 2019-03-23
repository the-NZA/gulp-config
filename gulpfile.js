const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const gulpif = require('gulp-if');

// Dev or Prod Mode Switch
const isDev = true;

const config = {
    img: {
        src: 'src/images/*',
        dest: './build/images'
    },
    css: {
        src: './src/less/index.less',
        dest: './build/css'
    },
    js: {
        src: './src/js/index.js',
        dest: './build/js'
    }
};

// Function For compile LESS to CSS
function styles() {
    return gulp.src(config.css.src)
            .pipe(gulpif(isDev, sourcemaps.init()))
            .pipe(less({
                paths: [path.join(__dirname, 'less')]
            }))
            .pipe(concat('style.css'))
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            }))
            .pipe(gulpif(!isDev, cleanCss({ level: 2 })))
            .pipe(gulpif(isDev, sourcemaps.write('./maps')))
            .pipe(gulp.dest(config.css.dest))
            .pipe(browserSync.stream());
}

// Function For compile JS
function scripts() {
    return gulp.src(config.js.src)
            .pipe(webpack({
                mode: isDev ? 'development' : 'production',
                devtool: isDev ? 'eval-source-map' : false,
                output: { filename: 'script.js' },
                module: {
                    rules: [
                      {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: ['@babel/preset-env']
                          }
                        }
                      }
                    ]
                }
            }))
            .pipe(gulp.dest(config.js.dest))
            .pipe(browserSync.stream());
}

//Function for img optimization(Now Basic Config)
function images() {
    return gulp.src(config.img.src)
            .pipe(gulp.dest(config.img.dest));
}


//Function for watching for changes and reload browsers
function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        browser: "firefox developer edition"
    });

    gulp.watch('./src/less/**/*.less', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

//Function for cleaning build directory before build or watch
function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);    // Styles Task
gulp.task('scripts', scripts);  // Scripts Task
gulp.task('images', images);    // Images Task
gulp.task('clean', clean);      // Clean Task

gulp.task('build', gulp.series(
    'clean', 
    gulp.parallel(
        'styles',
        'scripts',
        'images'
        )
));

gulp.task('watch', gulp.series(
    'build',
    watch
));

