module.exports = {
    entry: "./dist/client/index",

    output: {
        filename: "./wwwroot/js/bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".js"]
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader?presets[]=es2015" }
        ],
        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    externals: {
        "jquery": "jQuery",
        "react": "React",
        "react-dom": "ReactDOM",
        "socket.io-client": "io"
    }
};
