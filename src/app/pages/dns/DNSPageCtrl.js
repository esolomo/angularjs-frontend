/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';


  angular.module('BlurAdmin.pages.dns')
  .controller('ZoneManagerCtrl', ZoneManagerCtrl);

/** @ngInject */  


function ZoneManagerCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

  $scope.zone =  $rootScope.servername 

  $scope.addRecord = function(zone,name,value,ttl) {
    
        //ftp_user_data = {"domain":server,"username":username,"homedir":homedir,"password":password}
        //console.log({"domain":server,"username":username,"homedir":homedir,"password":password})
        //data['type'] = type
        //data['zone'] = $scope.zone
        var data = {'type':$scope.record_type,'zone':zone,'name':name}
        if ($scope.record_type == 'A' || $scope.record_type == 'AAAA' || $scope.record_type == 'CNAME'){
          data['destination'] = value
          data['ttl'] = ttl
        }
        else if ($scope.record_type == 'TXT'){
          data['entry'] = value
        }
        else if ($scope.record_type == 'MX'){
          data['priority'] = value
        }
        else if ($scope.record_type == 'ROOT_IPv4' || $scope.record_type == 'ROOT_IPv6'){
          data['value'] = value
        }
        else if ($scope.record_type == 'TTL' ){
          data['ttl'] = ttl
        }

        $http.put("/api/dns", data, { headers : {'Content-Type' : 'application/json'} })
        .then(function(response) {
            $rootScope.getZoneDetails(zone)
        });    
        $rootScope.addRecord.close('a');
      };

      $scope.setTypeSelected = function(type) {
        
          $scope.record_type = type
          console.log('type is : ' + type )
          return(type)
      };

}


  angular.module('BlurAdmin.pages.dns')
  .controller('ZoneDetailsCtrl', ZoneDetailsCtrl);

/** @ngInject */  


function ZoneDetailsCtrl($stateParams, $rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

  $rootScope.getZoneDetails = $scope.getZoneDetails = function(zone) {
    $http.get("/api/dns",  { "params": { "zone": zone } })
    .then(function(response) {
            $scope.zone = $stateParams.zoneId
            console.log(response.data)
            $scope.zone_data = response.data['results']
            $scope.zone_a = response.data['results']['A']
            $scope.zone_aaaa = response.data['results']['AAAA']
            $scope.zone_cname = response.data['results']['CNAME']
            $scope.zone_mx = response.data['results']['MX']
            $scope.zone_txt = response.data['results']['TXT']
            $scope.zone_srv = response.data['results']['SRV']
            $scope.root_ipv4 = response.data['results']['ROOT_IPv4']
            $scope.root_ipv6 = response.data['results']['ROOT_IPv6']
            $scope.soa = response.data['results']['SOA']
            $scope.ns = response.data['results']['NS']
            $scope.ttl = response.data['results']['TTL']
        });    
      };

if ($stateParams.zoneId){
  $rootScope.servername = $scope.servername = $stateParams.zoneId
  $scope.getZoneDetails($scope.servername)
  }

  $scope.applyZoneConfig = function(zone) {

    $http.post("/api/config/dns", {"zone":zone}, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {

        });
  };

  $scope.removeRecord = function(type, data) {
    
      //console.log("Request to remove entry " + data['name'] + " from type : " + type + " and zone " + $scope.servername)
      var params = {}
      if (typeof data === 'string' || data instanceof String){
        params['zone'] = $scope.servername
        params['type'] = type
        params['value'] = data
      }
      else {
        params = data
        params['zone'] = $scope.servername
        params['type'] = type
      }
      console.log(data)
      $http.delete("/api/dns", {"params":params})
      .then(function(response) {
          //console.log("Updating zone after removing entry" + data['name'] )
          $scope.getZoneDetails($scope.servername)
        });
  
  };



  $scope.addFTPUser = function(server,username,homedir,password) {

    //ftp_user_data = {"domain":server,"username":username,"homedir":homedir,"password":password}
    //console.log({"domain":server,"username":username,"homedir":homedir,"password":password})

    $http.post("/api/ftp/user", {"domain":server,"username":username,"datadir":homedir,"password":password}, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {

            $scope.ftp_data = response.data['results']
        });    
    $rootScope.addFTPInstance.close('a');
  };

    $scope.open = function (page, size) {
      $rootScope.addRecord = $uibModal.open({
        animation: true,
        controller: 'ZoneManagerCtrl',
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



  angular.module('BlurAdmin.pages.dns')
  .controller('ZoneCtrl', ZoneCtrl);

/** @ngInject */  


function ZoneCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {


  $scope.addDomain = function(ftpsite) {

    $scope.inserted = {
      name: ftpsite,
      status: 3,
      group:  3
    };
    $rootScope.modalInstance.close('a');
    $http.post("/api/domain", $scope.inserted, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
        });
  };

  $scope.addZone = function (zone) {
    $rootScope.modalInstance.close('a');
    $http.post("/api/dns",  {"name":zone} ,{headers : {'Content-Type' : 'application/json'}})
    .then(function(response) {
            $rootScope.getZones()
        });
  };



}


  angular.module('BlurAdmin.pages.dns')
      .controller('DNSPageCtrl', DNSPageCtrl);

  /** @ngInject */  

  function DNSPageCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

    $rootScope.getZones = $scope.getZones = function (zone) {
      $http.get("/api/dns",  config)
      .then(function(response) {
              if (response.data['status'] === "Success"){
                $scope.records = response.data['results'];
                
              }
              else{
                $scope.records = [] 
              }
          });
    };


    $scope.getZones()

    $scope.removeZone = function (zone) {
      $http.delete("/api/dns",  {"params":{"zone":zone,"type":"full"}})
      .then(function(response) {
              $scope.getZones()
          });
    };

    $scope.open = function (page, size) {
      $rootScope.modalInstance = $uibModal.open({
        animation: true,
        controller: 'ZoneCtrl',
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
    
    $scope.smartTablePageSize = 10;

    var UserData = {
      username: localStorage.getObject('dataUser')["username"],
    };

    var config = {
      params: UserData,
      headers : {'Content-Type' : 'application/json'}
     };
  }




})();
