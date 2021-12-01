const { src, dest, series, watch} = require('gulp');
const rm = require('gulp-rm');
const through2 = require('through2');
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
const tsProject = ts.createProject('tsconfig.json');
const { exec } = require("child_process");

function clean() {
    return src('public/**/*', { read: false})
        .pipe(rm());
}

function buildJs() {
    return src('src/*.ts')
        .pipe(tsProject())
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
            const textByLine = text.split('\n');
            const wordListIdealSize = 7776;
            const wordList = textByLine
                .map((v, i, a) => v.split('   '))
                .map((v, i, a) => v[1])
                .map((v, i, a) => v.toLowerCase());

            if (wordList.length != wordListIdealSize) {
                console.warn(`The list of words must have 7776 words, but ha only ${wordList.length}`);
                return;
            }
            file.contents = Buffer.from(JSON.stringify(wordList));
        }
        cb(null, file);
    });
}

function selectWordsBySize(wordList, size) {
    return wordList
        .map((v, i, a) => v.split('   '))
        .filter((v, i, a) => v[1].length == size);
}

function buildWordLists() {
    return src('wordlists/diceware.wordlist.*')
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
exports.dev = function() {
    watch(['src/*.ts', 'assets/**/*'], exports.default);
}
