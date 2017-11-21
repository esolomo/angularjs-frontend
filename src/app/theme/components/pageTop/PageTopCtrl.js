/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);
  
    /** @ngInject */
    function PageTopCtrl($scope, $http, $state) {

      $scope.logout = function() {
        $http.post("/api/logout", {  }, { headers : {'Content-Type' : 'application/json'} })
        .then(function(response) {
            });
        $state.go('authSignIn');
      };

    }
  })();