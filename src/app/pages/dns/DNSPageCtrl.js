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

  $scope.addRecord = function(type,zone,name,value,ttl) {
    
        //ftp_user_data = {"domain":server,"username":username,"homedir":homedir,"password":password}
        //console.log({"domain":server,"username":username,"homedir":homedir,"password":password})
        //data['type'] = type
        //data['zone'] = $scope.zone
        var data = {'type':type,'zone':zone,'name':name}
        if (type == 'A' || type == 'AAAA' || type == 'CNAME'){
          data['destination'] = value
          data['ttl'] = ttl
        }
        else if (type == 'TXT'){
          data['entry'] = value
        }
        else if (type == 'MX'){
          data['priority'] = value
        }
        else if (type == 'managed_zones'){
          data['managed_zones'] = value
        }
        else if (type == 'ROOT_IPv4' || type == 'ROOT_IPv6'){
          data['value'] = value
        }
        else if (type == 'TTL' ){
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
          return(type)
      };

}


  angular.module('BlurAdmin.pages.dns')
  .controller('ZoneDetailsCtrl', ZoneDetailsCtrl);

/** @ngInject */  


function ZoneDetailsCtrl($stateParams, $rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes, $state) {

  $rootScope.getZoneDetails = $scope.getZoneDetails = function(zone) {
    $http.get("/api/dns",  { "params": { "zone": zone } })
    .then(function(response) {
            $scope.zone = $stateParams.zoneId

            $scope.zone_data = response.data['results']
            $scope.main_zone = response.data['results']['main_zone']
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
            $scope.managed_zones = response.data['results']['managed_zones']
        });    
      };

if ($stateParams.zoneId){
    $rootScope.servername = $scope.servername = $stateParams.zoneId
    $scope.getZoneDetails($scope.servername)
    $scope.isSiteSelected = true
  }
else{
  $scope.isSiteSelected = false
}

$scope.gotoselectzone= function() {
  $state.go('main.dns.zones'); 
}
$scope.storeTTL= function(ttl) {
  $scope.old_ttl = ttl
}

$scope.updateTTL= function(ttl) {

  if ( $scope.old_ttl  == ttl ){

  }
  else{
    var data = {'type':'TTL','zone': $scope.zone, 'ttl':ttl }
    $http.put("/api/dns", data, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
      $scope.getZoneDetails($scope.zone)
    });

  }
}

$scope.applyZoneConfig = function(zone) {
  $http.post("/api/config/dns", {"zone":zone}, { headers : {'Content-Type' : 'application/json'} })
  .then(function(response) {
    $scope.open('app/pages/ui/modals/modalTemplates/configurationSuccessModal.html')
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

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


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

  editableOptions.theme = 'bs3';
  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


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

    $scope.deployDNSConfig = function() {
      $http.post("/api/deploy/dns", {}, { headers : {'Content-Type' : 'application/json'} })
      .then(function(response) {
        $scope.open('app/pages/ui/modals/modalTemplates/deployConfigurationSuccessModal.html')
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

     editableOptions.theme = 'bs3';
     editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
     editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

     
  }




})();
