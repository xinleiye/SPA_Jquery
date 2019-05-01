"use strict";

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const merge = require("webpack-merge");
const portfinder = require("portfinder");
const utils = require("./utils");
const config = require("../config");
const baseWebpackConfig = require("./webpack.base.conf");

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {},
    devtool: config.dev.devtool,
    output: {
        chunkFilename: "[name].[hash:8].js"
    },
    devServer: {},
    plugins: [
        new webpack.DefinePlugin({
            "process.env": require("../config/dev.env")
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: "./src/index.html",
            template: "./src/index.html",
            inject: true
        })
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
                    message: [`Your application is runing here: http://${config.dev.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig);
        }
    })
});