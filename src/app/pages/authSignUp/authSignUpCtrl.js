(function() {
  'use strict';

  angular.module('BlurAdmin.pages.authSignUp')
    .controller('authSignUpCtrl', authSignUpCtrl);

  /** @ngInject */
  function authSignUpCtrl($scope, $http, $state) {
    var vm = this;
    console.log(this);

    console.log("In signup controler");


    $scope.signinUp = function () {
          var data = {'fullname':$scope.fullname,'username':$scope.email,'password':$scope.password}
          var config = { headers :{'Content-Type': 'application/json'}}
          $http.post('/api/register',data, config)
          .success(function (data) {
              $state.go('authSignIn');
          })
          .error(function (data, status, header, config) {
          });
    }

  }

})();