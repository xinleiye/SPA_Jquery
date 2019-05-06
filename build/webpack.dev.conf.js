"use strict";

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const merge = require("webpack-merge");
const copyWebpackPlugin = require('copy-webpack-plugin');
const portfinder = require("portfinder");
const utils = require("./utils");
const config = require("../config");
const baseWebpackConfig = require("./webpack.base.conf");

const viewCoinfg = utils.createViewWebpackConfig("../src/view/");
const viewHtml = [];
const viewController = [];
viewCoinfg.map(function (file) {
    viewHtml.push(new HtmlWebpackPlugin({
        filename: `${config.dev.assetsSubDirectory}/html/${file.fileName}.html`,
        template: file.template,
        chunks: [file.fileName]
    }));
    viewController.push({
        from: file.controller,
        to: `${config.dev.assetsSubDirectory}/js/${file.fileName}.js`
    });
});

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {},
    devtool: config.dev.devtool,
    output: {
        chunkFilename: "[name].[hash:8].js"
    },
    devServer: {
        clientLogLevel: "warning",
        historyApiFallback: false,
        hot: true,
        compress: true,
        host: process.env.HOST || config.dev.host,
        port: process.env.PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
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
            inject: true
        }),
        ...viewHtml,
        new copyWebpackPlugin(viewController)
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
    })
});