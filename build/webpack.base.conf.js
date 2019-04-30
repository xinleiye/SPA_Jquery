"use strict";
const path = require("path");
const config = require("../config");
const utils = require("./utils");

function resolve (dir) {
    return path.join(__dirname, "..", dir);
}

isProductionEnv = process.env.node_ENV === "production";

module.exprots = {
    context: path.resolve(__dirname, "../"),
    entry: {
        app: ["./src/index.js"]
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].[hash].js",
        publicPath: isProductionEnv ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        "@": resolve("src")
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [{
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [resolve("src"), resolve("test")],
                options: {
                    formatter: require(""),
                    emitWarning: !config.dev.showEslintErrorsInOverlay
                }
            }] : []),
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 2000,
                    name: utils.assetsPath("assets/image/[name].[ext]")
                }
            }
        ]
    }
};
