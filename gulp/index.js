"use strict";

var gulp = require("gulp");

require("./typescript");
require("./webpack");

gulp.task("default", ["typescript", "webpack"]);
