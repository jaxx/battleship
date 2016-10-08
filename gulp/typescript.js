"use strict";

var gulp = require("gulp");
var ts = require("gulp-typescript");

var tsconfig = require(process.cwd() + "/tsconfig.json");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("typescript", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});
