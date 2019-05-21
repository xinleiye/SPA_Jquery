"use strict";

const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
/* const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin"); */

const env = process.env.NODE_ENV === "testing"
    ? require("../config/test.env")
    : require("../config/prod.env");

const viewCoinfg = utils.createViewWebpackConfig("../src/view/");
const viewTemplate = [];
const viewController = {};
const entryChunks = ["index"];
viewCoinfg.map(function (file) {
    viewTemplate.push(new HtmlWebpackPlugin({
        filename: `${config.dev.assetsSubDirectory}/html/${file.fileName}.html`,
        template: file.template,
        inject: false
    }));

    viewController[file.fileName] = [file.controller];
    entryChunks.push(file.fileName);
});

const entries = merge({index: ["./src/index.js"]}, viewController);

const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    entry: entries,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath("js/[name].js")
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
        /* new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
            ? { safe: true, map: {inline: false} }
            : { safe: true}
        }), */
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === "testing"
                ? "index.html"
                : config.build.index,
            template: "index.html",
            inject: true,
            chunks: ["manifest", "vendor", "common", "index"],
            minify: {
                removeComments: true,
                collaspseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: "manual"
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 将第三方依赖库打包到verdor中；源文件：未指定chunks，则为所有的入口文件
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, "../node_modules")
                    ) === 0
                );
            }
        }),
        // 提取出webpack运行时文件
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        // 提取所有入口文件中公共依赖
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            chunks: entryChunks,
            minChunks: 2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "app",
            async: "vendor-async",
            children: true,
            minChunks: 5
        }),
        ...viewTemplate,

        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../src/lib"),
                to: path.resolve(__dirname, "../dist/" + config.build.assetsSubDirectory + "/lib"),
                ignore: [".*"]
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../src/assets/css"),
                to: path.resolve(__dirname, "../dist/" + config.build.assetsSubDirectory + "/assets/css"),
                ignore: ["*.less"]
            }
        ])/* ,
        new MomentLocalesPlugin({
            localesToKeep: ["zh-cn"]
        }) */
    ]
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require("compression-webpack-plugin");

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" +
                config.build.productionGzipExtensions.join("|") +
                ")$"
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
