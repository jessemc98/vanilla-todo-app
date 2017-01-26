module.exports = {
    entry: './src/index.js',
    output: {
        path: './bin',
        filename: 'app.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [ 'style-loader', 'css-loader', 'sass-loader' ]
        }
      ]
    }
};
