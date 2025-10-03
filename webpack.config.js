const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    background: './background/background.ts',
    popup: './popup/popup.ts',
    options: './options/options.ts',
    content: './content/content-main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  devtool: 'source-map',
};
