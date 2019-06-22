const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'frontend', 'index.js'),
  output: {
    path: join(__dirname, 'frontend', 'built', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}