"use strict";
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require("../config");
const utils = require("./utils");

const extractTextCSS = new ExtractTextPlugin(config.build.assetsSubDirectory + "/css/[name].css");

function resolve (dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    output: {
        path: config.build.assetsRoot,
        filename: "[name].[hash].js",
        publicPath: process.env.node_ENV === "production" ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    externals: {
        jquery: "jQuery"
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@": resolve("src")
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [{
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [resolve("src"), resolve("test")],
                options: {
                    formatter: require("eslint-friendly-formatter"),
                    emitWarning: !config.dev.showEslintErrorsInOverlay
                }
            }] : []),
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: true,
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    name: utils.assetsPath("assets/images/[name].[ext]")
                }
            },
            {
                test: /\.(html)$/,
                include: path.resolve(__dirname, "../src/view"),
                exclude: path.resolve(__dirname, "../node_modules"),
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        extractTextCSS
    ]
};
