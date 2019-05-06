"use strict";
const path = require("path");
const config = require("../config");
const utils = require("./utils");

function resolve (dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    entry: {
        app: ["./src/index.js"]
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].[hash].js",
        publicPath: process.env.node_ENV === "production" ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    externals: {
        "jquery": "window.jquery"
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@": resolve("src")
        }
    },
    module: {
        rules: [
            /* ...(config.dev.useEslint ? [{
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [resolve("src"), resolve("test")],
                options: {
                    formatter: require("eslint-friendly-formatter"),
                    emitWarning: !config.dev.showEslintErrorsInOverlay
                }
            }] : []), */
            {
                test: /\.(css)$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(less)$/,
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    name: utils.assetsPath("assets/images/[name].[ext]")
                }
            }
        ]
    }
};
