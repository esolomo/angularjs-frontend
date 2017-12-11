/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.tables', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.ftp', {
        url: '/ftp',
        template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        controller: 'TablesPageCtrl',
        title: 'FTP Management',
        sidebarMeta: {
          icon: 'ion-ios-folder',
          order: 300,
        },
        authenticate: true
      }).state('main.ftp.list', {
        url: '/sites',
        templateUrl: 'app/pages/tables/smart/tables.html',
        title: 'Sites',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      }).state('main.ftp.details', {
        url: '/details/:siteId>',
        templateUrl: 'app/pages/tables/smart/details.html',
        title: 'Users',
        controller: 'SiteDetailsCtrl',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      });
    $urlRouterProvider.when('/main/tables', '/main/tables/basic');
  }

})();