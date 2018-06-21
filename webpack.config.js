const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
  const config = {
    entry: {
      renderer: path.resolve(__dirname, 'renderer/index.js')
    },
    output: {
      publicPath: '/',
      filename: '[name].js',
      path: path.resolve(__dirname),
    },
    module: {
      loaders: [
        {
          rules: [
            {
              test: /\.css$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'postcss-loader', options: { plugins: () => [autoprefixer] } }
              ]
            },
            {
              test: /\.scss$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'postcss-loader', options: { plugins: () => [autoprefixer] } },
                { loader: 'sass-loader' }]
            },
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              use: [
                'url-loader?limit=10000',
                'img-loader'
              ]
            }
          ]
        },
        {
          loader: 'babel-loader',
          include: [
            path.join(__dirname, '/renderer/')
          ],
          exclude: /(node_modules|bower_components)/,
          test: /\.jsx?$/,
          query: {
            presets: ['stage-2', 'env', 'react']
          }
        },
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^(fs|os|child_process|electron)$/)
    ]
  };
  if (env.development)
    config.devtool = 'inline-source-map';
  if (env.production)
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new UglifyJsPlugin({})
    ]);
  return config;
};
