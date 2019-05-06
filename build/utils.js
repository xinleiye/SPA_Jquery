"use strict"
const path = require("path");
const config = require("../config");
const pkg = require("../package.json");
const glob = require("glob");

exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === "production"
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path);
};

exports.createViewWebpackConfig = function (rootPath) {
    var fileConfig = [];
    var files = glob.sync(path.join(__dirname, rootPath + "**/*.html"));

    for (var file of files) {
        var fileName = file.match(/\w{0,}(?=\.html)/)[0];
        fileConfig.push({
            fileName: fileName,
            template: file,
            controller: file.replace("html", "js"),
            styles: fileName + "css",
        });
    }

    return fileConfig;
};

exports.createNotifierCallback = function () {
    const notifier = require("node-notifier");

    return (severity, errors) => {
        if (severity !== "error") {
            return;
        }

        const error = errors[0];
        const filename = error.file && error.file.split("!").pop();

        notifier.notify({
            title: pkg.name,
            message: severity + ": " + error.name,
            subtitle: filename || "",
            icon: path.join(__dirname, "logo.png"),
        });
    }
};