const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const shouldAnalyzeBuild = process.env.BUILD_MODE === 'analyze'

module.exports = {
    entry: ['./src/index.jsx'],
    target: 'web',
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        historyApiFallback: true,
        https: true
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff2?$|.ttf$|.eot$|.wav$|.mp3$|.html$/,
                loader: `${require.resolve('file-loader')}?name=[path][name].[ext]`
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            PropTypes: 'prop-types',
            ReactGA: 'react-ga',
            Icon: ['react-icons-kit', 'Icon'],
            horizontalCenter: ['react-icons-kit', 'horizontalCenter'],
            colors: 'colors'
        }),
        new CopyWebpackPlugin([
            { from: 'src/index.html', to: 'index.html' },
            { from: 'src/assets', to: 'assets' }
        ]),
        new BundleAnalyzerPlugin({
            analyzerMode: shouldAnalyzeBuild ? 'server' : 'disabled',
            analyzerPort: 8081
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            colors: path.resolve(__dirname, './src/styles/theme')
        }
    }
}
