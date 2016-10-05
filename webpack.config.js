var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var config = {
    entry: [
        path.resolve(__dirname, 'src/App.jsx'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,"build"),
    },
    module: {

        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            // display only errors to reduce the amount of output
            stats: 'errors-only',

            // parse host and port from env so this is easy
            // to customize
            host: process.env.HOST,
            port: process.env.PORT
        },

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react','stage-2']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?modules"
            },

            {
                test: /\.scss$/,
                loaders: ["style", "css?sourceMap", "sass?sourceMap"]
            }
        ]
    },

    plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
};

module.exports = config;