// webpack.config.js
const path = require('path');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.ts', 'tsx'],
        plugins: [new TsconfigPathsPlugin({})],
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack'),
                    ],
                ],
            },
        ],
    },
};