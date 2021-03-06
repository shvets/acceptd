'use strict';

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
//var Manifest    = require('manifest-revision-webpack-plugin');
var TextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
//var _ = require('lodash');

function getEnvironment() {
  return process.env.NODE_ENV;
}

function isProduction() {
  return getEnvironment() === 'production';
}

function isDevelopment() {
  return getEnvironment() === 'development';
}

function projectRoot() {
  return path.dirname(fs.realpathSync(__filename));
}

function projectDependencies() {
  return Object.keys(require(projectRoot() + '/package').dependencies);
}


if (!getEnvironment()) {
  throw 'Can\'t find local environment variable via process.env.NODE_ENV';
}

var mainJsFile = path.join(projectRoot(), 'public', 'app', 'app.js');
var mainHtmlTemplate = path.join(projectRoot(), 'public', 'app', 'acceptd', 'index.html');

var buildPath = path.join(projectRoot(), 'build');
var publicPath = '/';

var config = {};

config.debug = isProduction() ? false : true;

config.entry = {
  application: mainJsFile,
  vendors: projectDependencies()
};

config.output = {
  path: buildPath,
  filename: path.join('assets', 'js', '[name].bundle.[chunkhash].js'),
  chunkFilename: '[id].bundle.[chunkhash].js',
  publicPath: publicPath
};

config.plugins = [
  //new webpack.IgnorePlugin(/\.(css|less)$/),
  new webpack.BannerPlugin('require("source-map-support").install();', {raw: true, entryOnly: false}),

  new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/js/vendors.[hash].js'),

  new TextPlugin('assets/css/[name].[hash].css'),

  //new Manifest(path.join(projectRoot + '/src/config', 'manifest.json'), {
  //  rootAssetPath: rootAssetPath
  //}),

  new HtmlPlugin({
    title: 'Test App',
    chunks: ['application', 'vendors'],
    filename: 'index.html',
    template: mainHtmlTemplate
  })
];

config.devtool = '#eval-source-map';

if (isDevelopment()) {
  config.devServer = {
    contentBase: config.output.path,
    info: true,
    hot: false,
    inline: true
  }
}

// Небольшие настройки связанные с тем, где искать сторонние библиотеки
config.resolve = {
  extensions: ['', '.js'],
  modulesDirectories: ['node_modules']
  // Алиасы - очень важный инструмент для определения области видимости ex. require('_modules/test/index')
  //alias: {
  //  _svg:         path.join(projectRoot(), 'app', 'assets', 'svg'),
  //  _data:        path.join(projectRoot(), 'app', 'data'),
  //  _fonts:       path.join(projectRoot(), 'app', 'assets', 'fonts'),
  //  _modules:     path.join(projectRoot(), 'app', 'modules'),
  //  _images:      path.join(projectRoot(), 'app', 'assets', 'images'),
  //  _stylesheets: path.join(projectRoot(), 'app', 'assets', 'stylesheets'),
  //  _templates:   path.join(projectRoot(), 'app', 'assets', 'templates')
  //}
};
//
//// Настройка загрузчиков, они выполняют роль обработчика исходного файла в конечный
//config.module = {
//  loaders: [
//    { test: /\.jade$/, loader: 'jade-loader' },
//    { test: /\.(css|ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i, loaders: ['file?context=' + projectRoot() +'/app' + '&name=assets/static/[ext]/[name].[hash].[ext]'] },
//    { test: /\.styl$/, loader: TextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?browsers=last 5 version!stylus-loader') }
//  ]
//};

module.exports = config;
