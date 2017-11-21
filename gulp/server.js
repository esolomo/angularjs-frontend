'use strict';

var path = require('path');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    middleware: [proxyMiddleware],
    routes: routes,
    ghostMode: false,
    https: {
      key: "./ssl/targetweb.betterdevops.co.uk.key",
      cert: "./ssl/targetweb.betterdevops.co.uk.crt"
      }
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});
  server.middleware = proxyMiddleware('/api', {target: 'http://localhost:5000', changeOrigin: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    ui: false,
    browser: browser,
    livereload: {
      start: true,
      port: 35735
    },
    ghostMode: false,
    logLevel: "debug"
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
  livereload.listen();
});

gulp.task('serve:dist', ['build'], function () {
  livereload.listen();
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
