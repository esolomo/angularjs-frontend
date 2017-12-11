/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'BlurAdmin.pages.services',
      'BlurAdmin.pages.config',
      'BlurAdmin.pages.main',
      'BlurAdmin.pages.dashboard',
//      'BlurAdmin.pages.ui',
//      'BlurAdmin.pages.components',
//      'BlurAdmin.pages.form',
      'BlurAdmin.pages.dns',
      'BlurAdmin.pages.settings',
      'BlurAdmin.pages.tables',
//      'BlurAdmin.pages.charts',
//      'BlurAdmin.pages.maps',
      'BlurAdmin.pages.profile',
      'BlurAdmin.pages.authSignIn',
      'BlurAdmin.pages.authSignUp',
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/authSignIn');
  }

})();