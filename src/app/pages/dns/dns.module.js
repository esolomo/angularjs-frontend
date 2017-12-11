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
          icon: 'ion-earth',
          order: 300,
        },
        authenticate: true
      }).state('main.dns.zones', {
        url: '/zones',
        templateUrl: 'app/pages/dns/smart/dns.html',
        title: 'Zones',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      }).state('main.dns.details', {
        url: '/details/:zoneId>',
        templateUrl: 'app/pages/dns/smart/details.html',
        title: 'Records',
        controller: 'ZoneDetailsCtrl',
        sidebarMeta: {
          order: 100,
        },
        authenticate: true
      });
    $urlRouterProvider.when('/main/dns', '/main/dns/basic');
  }

})();