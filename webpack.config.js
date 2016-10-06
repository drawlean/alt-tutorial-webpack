var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSCSS = new ExtractTextPlugin('[name].[chunkhash].css');
const CleanPlugin = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

var base = {
    entry: {
        app: path.resolve(__dirname, 'src/App.jsx'),
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname,"build"),
    },

    module: {

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react','stage-2']
                }
            }
        ]
    },
};

if(TARGET === 'dev' || !TARGET) {

    module.exports = merge(base, {
        devServer: {
            historyApiFallback: true,
            //hot: true,
            inline: true,
            progress: true,
            // display only errors to reduce the amount of output
            stats: 'errors-only',
            devtool: eval,
            colors: true,
            contentBase: "./build",

            // parse host and port from env so this is easy
            // to customize
            host: "0.0.0.0",// process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ["style", "css?sourceMap", "sass?sourceMap"]
                }
            ]
        },

        plugins: [
            new OpenBrowserPlugin({url: 'http://localhost:8080'}),
        ]
    });
}

if(TARGET === 'build' || TARGET === 'prod') {

    module.exports = merge(base, {
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: extractSCSS.extract('style', 'css!sass?sourceMap'),
                }
            ]
        },
        plugins: [
            extractSCSS,
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "build/template.html"),
            }),
            new CleanPlugin(['build'], {
                root: path.resolve(__dirname,"./"),
                verbose: true,
                exclude: ['template.html','logo.png']
            })
        ]
    });
}