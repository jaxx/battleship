var nodeExternals = require("webpack-node-externals");
var path = require("path");

var clientConfig = {
    entry: "./src/client/index",

    output: {
        filename: "./wwwroot/js/bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: "/node_modules|vue\/src/",
                use: {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "source-map-loader",
                enforce: "pre"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ]
    },

    externals: {
        "jquery": "jQuery",
        "socket.io-client": "io",
        "vue": "Vue",
        "vue-class-component": "VueClassComponent",
        "vuex": "Vuex"
    }
};

var serverConfig = {
    entry: {
        "battleship": "./src/battleship",
        "upgrade": "./src/upgrade"
    },

    output: {
        path: path.resolve("./dist/"),
        filename: "[name].js"
    },

    target: "node",

    node: {
        __dirname: false
    },

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },

    externals: [
        nodeExternals()
    ]
};

module.exports = [
    clientConfig,
    serverConfig
];
