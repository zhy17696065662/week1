var gulp=require('gulp');
var sass=require('gulp-sass');
var server=require('gulp-webserver');
var fs=require('fs');
var path=require('path');
var url=require('url');
var clean=require('gulp-clean-css');
var babel=require('gulp-babel');
var uglify=require('gulp-uglify');
var concat=require('gulp-concat');
var htmlmin=require('gulp-htmlmin');

//编译scss
gulp.task('scss',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css/'))
})
//起服务
gulp.task('servers',function(){
    return gulp.src('./src/')
    .pipe(server({
        port:8888,
        livereload:true,
        open:true,
        middleware:function(req,res,next){
            console.log(req.url)
            var pathname=url.parse(req.url).pathname;
            if(pathname=='/favicon.ico'){
                return res.end('')
            }else{
                var pathname=pathname=='/'?'index.html':pathname;
                res.end(fs.readFileSync(path.join(__dirname,'src',pathname)))
            }
        }
    }))
})
//监听scss
gulp.task('watch',function(){
    gulp.watch('./src/scss/*.scss',gulp.series('scss'))
})
//开发环境
gulp.task('default',gulp.series('scss','servers','watch'))

//压缩css
gulp.task('devCss',function(){
    return gulp.src('./src/css/*.css')
    .pipe(clean())
    .pipe(gulp.dest('./dist/css/'))
})
//编译合并压缩js
gulp.task('devJs',function(){
    return gulp.src('./src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({
        presets:'es2015'
        }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
})
//压缩html
gulp.task('devHtml',function(){
    return gulp.src('./src/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/'))
})
//线上环境
gulp.task('build',gulp.parallel('devCss','devJs','devHtml'))
