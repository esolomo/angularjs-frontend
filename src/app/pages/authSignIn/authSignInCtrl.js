(function() {
  'use strict';

  angular.module('BlurAdmin.pages.authSignIn')
    .controller('authSignInCtrl', authSignInCtrl);

  /** @ngInject */
  function authSignInCtrl($scope, $http,localStorage, $state) {
    var vm = this;

    vm.logar = logar;

    init();

    $http.get("/api/session")
    .then(function(response) {
            console.log(response.data)
            if (response.data['status']){
              console.log("To dashboard")
              $state.go('main.dashboard');
            }
        });

    function init() {
      localStorage.clear();
    }

    function logar() {

      var UserData = {
        username: vm.user,
        password: vm.password
      };

      var config = {
        withCredentials : true,
        headers : {
            'Content-Type': 'application/json',
            'Authorization':  'Basic ' + btoa(vm.user + ":" + vm.password)
        }
      }

    $http.post('/api/login', UserData, config)
    .success(function (data, status, headers, config) {
        $scope.PostDataResponse = data;
        localStorage.setObject('dataUser', UserData);
        $state.go('main.dashboard');
    })
    .error(function (data, status, header, config) {
        console.log('User has not been found')
        //$scope.ResponseDetails = "Data: " + data + "<hr />status: " + status + "<hr />headers: " + header + "<hr />config: " + config;
        //console.log("Error request -  Data: " + data + "<hr />status: " + status + "<hr />headers: " + header + "<hr />config: " + config);
        alert("Error user/passwd");
        localStorage.clear()
    });


      var dadosUser = {
        username: vm.user,
        password: vm.password
      };
      //console.log(dadosUser)
      //localStorage.setObject('dataUser', dadosUser);
      //$state.go('main.dashboard');
    }


  }

})();