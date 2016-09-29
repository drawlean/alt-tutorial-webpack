var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
//var babelpolyfill = require("babel-polyfill");

var config = {
    entry: [
        path.resolve(__dirname, 'src/App.jsx'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,"build"),
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            loader: 'babel',
            query:
            {
                presets:['es2015',  'react']
            }
        }]
    },

    plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
};

module.exports = config;