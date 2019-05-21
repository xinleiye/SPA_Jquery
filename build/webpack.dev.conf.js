"use strict";

const webpack = require("webpack");
// const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const merge = require("webpack-merge");
// const copyWebpackPlugin = require('copy-webpack-plugin');
const portfinder = require("portfinder");
const utils = require("./utils");
const config = require("../config");
const baseWebpackConfig = require("./webpack.base.conf");

const viewCoinfg = utils.createViewWebpackConfig("../src/view/");
const viewTemplate = [];
const viewController = {};
viewCoinfg.map(function (file) {
    viewTemplate.push(new HtmlWebpackPlugin({
        filename: `${config.dev.assetsSubDirectory}/html/${file.fileName}.html`,
        template: file.template,
        inject: false
    }));

    viewController[file.fileName] = [file.controller];
});

const entries = merge({index: ["./src/index.js"]}, viewController);

const devWebpackConfig = merge(baseWebpackConfig, {
    entry: entries,
    devtool: config.dev.devtool,
    output: {
        path: config.dev.assetsRoot,
        filename: utils.assetsPath("js/[name].js")
    },
    devServer: {
        clientLogLevel: "warning",
        // 请求资源发生404错误时，是否使用index.html替代：false：不替代
        historyApiFallback: false,
        hot: true,
        // true: 对所有服务器采用gzip压缩
        compress: true,
        host: process.env.HOST || config.dev.host,
        port: process.env.PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        // 编译出错时，是否在浏览器显示错误
        overlay: config.dev.errorOverlay ? {
            warning: false,
            errors: true
        } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true,
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": require("../config/dev.env")
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            inject: true,
            chunks: ["index"]
        }),
        ...viewTemplate
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            process.env.PORT = port;
            devWebpackConfig.devServer.port = port;
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is runing here: http://${config.dev.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig);
        }
    });
});