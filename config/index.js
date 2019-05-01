"use strict";

const path = require("path");

module.exports = {
    dev: {
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        host: "localhost",
        port: 8080,
        autoOpenBrowser: false,
        erroyOverlay: true,
        notifyOnErrors: true,
        poll: false,
        useEslint: true,
        showEslintErrorsInOverlay: false,
        proxyTable: {
            "/normFramePublicity": {
                target: "http://172.16.16.134:8080",
                secure: false,
                changeOrigin: true
            }
        },
        devtool: "eval-source-map",
        cssSourceMap: false
    },
    build: {
        index: path.resolve(__dirname, "../dist/index.html"),
        assetsRoot: path.resolve(__dirname, "../dist"),
        assetsSubDirectory: "static",
        assetsPublicPath: "/prod",

        producionSourceMap: true,
        devtool: "#source-map",
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],
        bundleAnalyzerReport: process.env.npm_config_report
    },
};
