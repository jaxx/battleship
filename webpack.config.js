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
