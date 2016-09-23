var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var config = {
    entry: [
        path.resolve(__dirname, 'src/App.jsx'),
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
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