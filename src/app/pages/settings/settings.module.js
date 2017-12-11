/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.settings', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.settings', {
        url: '/settings',
        template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        controller: 'SettingsPageCtrl',
        title: 'Settings',
        sidebarMeta: {
          icon: 'ion-android-settings',
          order: 300,
        },
        authenticate: true
      }).state('main.settings.parameters', {
        url: '/parameters',
        templateUrl: 'app/pages/settings/smart/parameters.html',
        title: 'Parameters',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      });
    $urlRouterProvider.when('/main/dns', '/main/dns/basic');
  }

})();