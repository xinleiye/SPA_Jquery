"use strict"
const path = require("path");
const config = require("../config");

exports.assetsPath = function (_path) {
    const assetsSubDirectiory = process.env.NODE_ENV === "production"
        ? config.build.assetsSubDirectiory
        : config.dev.assetsSubDirectiory

    return path.posix.join(assetsSubDirectiory, _path);
}