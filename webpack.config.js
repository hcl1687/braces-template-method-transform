const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    'braces-template-method-transform': './src/index.js',
    'braces-template-method-transform.min': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'BracesTemplateMethodTransform',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      mangle: {
        properties: {
          screw_ie8: false
        }
      },
      compress: {
        screw_ie8: false
      },
      output: {
        screw_ie8: false
      }
    })
  ]
}
