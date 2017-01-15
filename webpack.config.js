var nodeExternals = require("webpack-node-externals");

var clientConfig = {
    entry: "./src/client/index",

    output: {
        filename: "./wwwroot/js/bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "babel-loader?presets[]=es2015!awesome-typescript-loader" }
        ],
        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    externals: {
        "jquery": "jQuery",
        "react": "React",
        "react-dom": "ReactDOM",
        "socket.io-client": "io",
        "vue": "Vue",
        "vue-class-component": "VueClassComponent"
    }
};

var serverConfig = {
    entry: {
        "battleship": "./src/battleship",
        "upgrade": "./src/upgrade"
    },

    output: {
        path: "./dist/",
        filename: "[name].js"
    },

    target: "node",

    node: {
        __dirname: false
    },

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    },

    externals: [
        nodeExternals()
    ]
};

module.exports = [clientConfig, serverConfig];
