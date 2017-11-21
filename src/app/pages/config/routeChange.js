(function() {
  'use strict';

  angular.module('BlurAdmin.pages.config')
    .run(stateChangeStart);

  /** @ngInject */
  function stateChangeStart($rootScope, $http, $state, localStorage) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      var login = localStorage.getObject('dataUser');
      $http.get("/api/session")
      .then(function(response) {
              if (!response.data['status']){
                console.log("To dashboard")
                //$state.go('main.dashboard');
                if (toState.url ==  '/authSignUp'){
                  $state.transitionTo("authSignUp");
                }
                else{
                  $state.transitionTo("authSignIn");
                }
                event.preventDefault();
              }
          });
      //if (toState.authenticate && _.isEmpty(login)) {
        // User isn’t authenticated
      //  $state.transitionTo("authSignIn");
      //  event.preventDefault();
      //}
    });
  }

})();