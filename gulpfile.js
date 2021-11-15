const { src, dest, series} = require('gulp');
const rm = require('gulp-rm');
const through2 = require('through2');
const rename = require("gulp-rename");
const run = require('gulp-run-command').default;

function clean() {
    return src('public/**/*', { read: false})
        .pipe(rm());
}

function buildJs() {
    return src('src/*.js')
        .pipe(dest('public/js/'));
}

function copyAssets() {
    return src('assets/**/*')
        .pipe(dest('public/'))
}

function textListToJson() {
    return through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
            const text = file.contents.toString();
            const textByLine = text.split('\r\n');
            const wordList = textByLine
                .filter((v, i, a) => v.length < 7)
                .filter((v, i, a) => i < 7777)
                .map((v, i, a) => v.toLowerCase());
            
            file.contents = Buffer.from(JSON.stringify(wordList));
        }
        cb(null, file);
    });
}

function buildWordLists() {
    return src('wordlists/*.txt')
        .pipe(textListToJson())
        .pipe(rename(function(path) {
            path.extname = '.json';
        }))
        .pipe(dest('public/wordlists/'));
}

exports.clean = clean;
exports.default = series(
    clean,
    buildJs,
    copyAssets,
    buildWordLists
);