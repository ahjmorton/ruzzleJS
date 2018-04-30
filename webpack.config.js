const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry : './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this'
  },
  module : {
    rules: [
      {
        test: /\.js$/,
        exclude : /node_modules/,
        use: [{
           loader: 'babel-loader'
        }]
      },
      {
        test : /\.html$/,
        use: [{
          loader: "html-loader",
        }]
      },
      {
        test : /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader'
        ]
      },
      {
        test: /\.worker\.js$/,
        use: [{
          loader: "worker-loader"
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
       template: 'src/index.html',
       filename: 'index.html'
    }),
  ]
};
