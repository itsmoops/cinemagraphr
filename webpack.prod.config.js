const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// remove dev process.env flag
webpackConfig.plugins.splice(0, 1)

webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new UglifyJSPlugin()
])

module.exports = webpackConfig
