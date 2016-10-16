var path = require('path');
const webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSCSS = new ExtractTextPlugin('[name].[chunkhash].css');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    build : path.join(__dirname, 'build'),
    root  : path.resolve(__dirname),
    template : path.join(__dirname, 'template.html'),
    logo : path.join(__dirname, 'logo.png'),
};

const requestPaths = {
    stage: "http://staging.onedesk-media.com//v1",
    dev: "http://localhost:8080",
    production: "https://api.onedesk-media.com/v1"
};

const htmlPluginDefine = {
    template: 'index.ejs',
    title: '小白学React',
    appMountId: 'ReactApp',
    inject: false,
    baseHref: '/'
};


var base = {
    entry: {
        app: path.resolve(__dirname, 'src/App.jsx'),
    },
    output: {
        filename: '[name].js',
        path: PATHS.build,
    },

    module: {

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react','stage-2'],
                    compact: false
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: "logo.png"},
            {from: "ajax-loader.gif"},
        ]),
    ]
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
            outputPath: PATHS.build,
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

            new HtmlWebpackPlugin(Object.assign(htmlPluginDefine, {
                filename: 'index.html',
            })),

            new OpenBrowserPlugin({url: 'http://localhost:8080'})
        ]
    });
}

if(TARGET === 'build' || TARGET === 'prod') {

    module.exports = merge(base, {
        output: {
            filename: '[name].[chunkhash].js',
            path: PATHS.build,
            chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: extractSCSS.extract('style', 'css!sass?sourceMap'),
                }
            ]
        },
        plugins: [

            new CleanPlugin(['build'], {
                root: PATHS.root,
                verbose: true
            }),
            extractSCSS,
            new HtmlWebpackPlugin(Object.assign(htmlPluginDefine, {
                baseHref:'/',
                filename: 'index.html',
            })),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

        ]
    });
}