/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
  .controller('AddingSSHKeyCtrl', AddingSSHKeyCtrl);

/** @ngInject */  


function AddingSSHKeyCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

  $scope.addSSHKey = function(key_name,ssh_user,ssh_key) {
    $rootScope.modalInstance.close('a');
    $http.post("/api/settings/ssh", {'name':key_name, 'ssh_user':ssh_user, 'ssh_key':ssh_key}, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
        $rootScope.getSettings()
        $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
      });

  };

  $scope.open = function (page, size) {
    $rootScope.modalBaseInstance = $uibModal.open({
      animation: true,
      templateUrl: page,
      controllerAs: 'modal',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

  };


}

  angular.module('BlurAdmin.pages.settings')
      .controller('SettingsPageCtrl', SettingsPageCtrl);

  /** @ngInject */  

  function SettingsPageCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

    var config = {
      headers : {'Content-Type' : 'application/json'}
     };


     $rootScope.getFTPSettings = $scope.getFTPSettings = function () {
      $http.get("/api/settings/ftp",  {"params": {} })
      .then(function(response) {
              if (response.data['status'] === "Success"){
                $scope.ftp_settings = response.data['results'];
              }
              else{
                $scope.ftp_settings = [] 
              }
          });
    };

    $scope.setFTPSettings = function(type, name) {
      
            $http.post("/api/settings/ftp", {'type':type, 'value':name}, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
                 $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
                 $scope.getFTPSettings()
              });
          };

     $rootScope.getDNSSettings = $scope.getDNSSettings = function () {
      $http.get("/api/settings/dns",  {"params": {} })
      .then(function(response) {
              if (response.data['status'] === "Success"){
                $scope.dns_settings = response.data['results'];
              }
              else{
                $scope.dns_settings = [] 
              }
          });
    };


    $scope.setDNSSettings = function(type, name) {
      
            $http.post("/api/settings/dns", {'type':type, 'value':name}, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
                 $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
                 $scope.getDNSSettings()
              });
          };


    $rootScope.getSettings = $scope.getSettings = function () {
      $http.get("/api/settings/ssh",  { headers : {'Content-Type' : 'application/json'} })
      .then(function(response) {
              if (response.data['status'] === "Success"){
                $scope.settings = response.data['results'];
              }
              else{
                $scope.settings = [] 
              }
          });
    };

    $scope.removeSSH_ID = function(name) {
      
        $http.delete("/api/settings/ssh", {"params": {'name':name} })
        .then(function(response) {
              $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
              $scope.getSettings()
        });
    };

    $scope.createSSH_ID = function(name,ssh_user,ssh_key) {
      
            $http.post("/api/settings/ssh", {'name':name,'ssh_user':ssh_user,'ssh_key':ssh_key}, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
                 $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
                 $scope.getSettings()
              });
    };

    $scope.UpdateSSH_User = function(user_id, user) {
            $http.put("/api/settings/ssh", {'name':user_id.name,'ssh_user': user,'ssh_key':user_id.ssh_key}, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
                 $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
                 $scope.getSettings()
              });
    };

    $scope.UpdateSSH_Key = function(user_id, key) {
            $http.put("/api/settings/ssh", {'name':user_id.name,'ssh_user':user_id.ssh_user,'ssh_key': key}, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
                 $scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
                 $scope.getSettings()
              });
    };


    $scope.getSettings()
    $scope.getDNSSettings()
    $scope.getFTPSettings()

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    $scope.open = function (page, size) {
      $rootScope.modalInstance = $uibModal.open({
        animation: true,
        controller: 'AddingSSHKeyCtrl',
        templateUrl: page,
        controllerAs: 'modal',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

    };

  }




})();
