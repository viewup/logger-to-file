const gulp = require('gulp');
const path = require("path");
const fs = require("fs");
const copy = require('gulp-copy');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const through = require('through2');
const base = __dirname;
const root = path.join(process.env.PWD.split('source')[0]);
const dist = path.join(root, 'packages', 'sicoob-events-server');


const copyFiles = (src, dest) => () => {
    return gulp
        .src(src)
        .pipe(copy(dest, {prefix: 1}))
        .pipe(verify());
};

function verify() {
    const options = {objectMode: true};
    return through(options, write, end);

    function write(file, enc, cb) {
        if (!fs.existsSync(file.path)) {
            return cb(true, new Error(file.path + " File not coppied"))
        }
        cb(null, file);
    }

    function end(cb) {
        cb();
    }
}

gulp.task('create:gitignore', cb => {
    if (!fs.existsSync(dist)) {
        return cb();
    }
    fs.writeFileSync(path.join(dist, '.gitignore'),
        `node_modules/
.idea/
yarn.lock
*.log
public/uploads/
packages/
dist/
*-lock.json
        `);
    cb()
});

gulp.task('copy:view', copyFiles([base + '/src/Views/*.*'], path.join(dist, 'src')));
gulp.task('copy:PorjectFile', copyFiles([
    base + '/package.json',
    base + '/www',
    base + '/run.js',
    base + '/ecosystem.config.js',
    base + '/.babelrc',
], path.join(dist)));

gulp.task('static', () => {
    return gulp
        .src([base])
        .pipe(gulp.dest(dist));
});

//gulp.task('install', () => {
//    gulp.src([path.join(dist, 'package.json')])
//        .pipe(install());
//});


//gulp.task('watch', tasks, () => {
//    return gulp.watch(files, tasks);
//});

gulp.task('build', ['scripts']);

gulp.task('scripts', ['static'], () => {
    const tsResult = tsProject
        .src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(dist));
});

const tasks = ['copy:PorjectFile', 'build', 'copy:view','create:gitignore'];
gulp.task('default', tasks);