const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/client/src/Index.jsx`,
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/public`
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"],
  },

  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "/client/public"),
  },
}
