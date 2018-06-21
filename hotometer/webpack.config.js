const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist/');
var APP_DIR = path.resolve(__dirname, 'hotometer/');

var config = {
    entry: {
      "hotometer": ['babel-polyfill', APP_DIR + '/hotometer.js'],
      "hotometer.min": ['babel-polyfill', APP_DIR + '/hotometer.js']
    },
    devtool: "source-map",
    output: {
        path: BUILD_DIR,
        filename: '[name].js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true
      })
    ],
    module : {
        loaders : [
            {
                test : [/\.js?/, /\.jsx?/],
                include : APP_DIR,
                loader : 'babel-loader'
            }
        ]
    }
};

module.exports = config;
