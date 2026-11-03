const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

require('dotenv').config({
  path: './.env',
});

const { DEV_PORT, DEV_IAM_URL } = process.env;

const config = {
  DEV_PORT,
  DEV_IAM_URL,
};

const { ModuleFederationPlugin } = webpack.container;

module.exports = (env, argv) => ({
  entry: './src/index',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
  devServer: {
    allowedHosts: 'all',
    // Enable gzip compression of generated files.
    compress: false,
    // Silence the dev server's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    client: {
      logging: 'none',
    },
    // Enable hot reloading server. Note that only changes to CSS are currently
    // hot reloaded. JS changes will refresh the browser.
    hot: true,
    historyApiFallback: true, // React Router
    // Serve, and reload on, anything already built into dist.
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
      watch: true,
    },
    port: config.DEV_PORT,
    host: '0.0.0.0',
    proxy: config.DEV_IAM_URL
      ? [
          {
            context: ['/iam-api'],
            target: config.DEV_IAM_URL,
            pathRewrite: { '^/iam-api': '' },
            secure: false,
          },
        ]
      : [],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // It automatically determines the public path from either
    // `import.meta.url`, `document.currentScript`, `<script />`
    // or `self.location`.
    publicPath: 'auto',
    // Hash files for cache busting
    filename: '[name].[contenthash].js',
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules', 'react'),
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                require.resolve('babel-plugin-syntax-async-functions'),
                require.resolve('@babel/plugin-transform-runtime'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(s)?css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // SCSS
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public/runtime-env.js', to: 'runtime-env.js' }],
    }),
    new EslintWebpackPlugin({
      extensions: ['ts', 'js', 'tsx', 'jsx'],
      exclude: ['node_modules'],
    }),
    new DotenvPlugin({
      systemvars: true,
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'reporting_hub_bop_role_ui',
      library: { type: 'var', name: 'reporting_hub_bop_role_ui' },
      filename: 'app.js',
      exposes: {
        './App': './src/Injector',
        './Menu': './src/Menu',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@modusbox/react-components'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ].filter(Boolean),
});
