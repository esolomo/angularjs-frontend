/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.dns', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.dns', {
        url: '/dns',
        template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        controller: 'DNSPageCtrl',
        title: 'DNS Management',
        sidebarMeta: {
          icon: 'ion-android-laptop',
          order: 300,
        },
        authenticate: true
      }).state('main.dns.list', {
        url: '/list',
        templateUrl: 'app/pages/dns/smart/dns.html',
        title: 'DNS Sites',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      }).state('main.dns.details', {
        url: '/details/:zoneId>',
        templateUrl: 'app/pages/dns/smart/details.html',
        title: 'DNS Details  Zone',
        controller: 'ZoneDetailsCtrl',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      });
    $urlRouterProvider.when('/main/dns', '/main/dns/basic');
  }

})();