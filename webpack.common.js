const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Touchless PoseNet',
            template: './src/index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.mp4$/,
                use: 'file-loader?name=videos/[name].[ext]',
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
