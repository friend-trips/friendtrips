const path = require('path');
const webpack = require('webpack')
module.exports = {
  entry: `${__dirname}/client/src/Index.jsx`,
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/public`
  }
}
