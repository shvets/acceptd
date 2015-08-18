'use strict';

var modRewrite = require('connect-modrewrite');
var browserSync = require('browser-sync');

var port = 4567;
var baseDir = 'public';
var rewrite = ['^[^\\.]*$ /index.html [L]'];

var files = [
  'public/index.html',
  'public/app/**/*.js',
  'public/app/**/*.html',
  'public/app/**/*.sass'
];

browserSync.instance = browserSync.init(files, {
  port: port,
  open: false,
  codeSync: false,
  server: {
    baseDir: baseDir,
    middleware: [
      modRewrite(rewrite)
    ],
    routes: {}
  },
  browser: 'default',
  ghostMode: true
});