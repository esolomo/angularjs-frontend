/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';



  angular.module('BlurAdmin.pages.tables')
  .controller('AddingSiteDetailsCtrl', AddingSiteDetailsCtrl);

/** @ngInject */  


function AddingSiteDetailsCtrl($stateParams, $rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

  $scope.servername = $stateParams.siteId 

  $scope.addFTPUser = function(server,username,homedir,password) {

    console.log("Adding FTP User " + server + " " + username + " " + homedir + " " + password)
    $http.post("/api/ftp/user", {"domain":server,"username":username,"datadir":homedir,"password":password}, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
            console.log("Checking user list ")
            console.log(response.data)
            console.log("Fetching new user list data ")
            $rootScope.getFTPSiteDetails()
        });    
    $rootScope.addFTPInstance.close('a');
  };

}

  angular.module('BlurAdmin.pages.tables')
  .controller('SiteDetailsCtrl', SiteDetailsCtrl);

/** @ngInject */  


function SiteDetailsCtrl($stateParams, $rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes, $state) {

  $scope.ftp_password = ''

  var config = {
    headers : {'Accept' : 'application/json'}
   };

   $scope.gotoselectsite= function() {
     console.log("going to main ftp list")
    $state.go('main.ftp.list'); 
  }


  console.log(localStorage.getObject('dataUser')["username"])

  $scope.initsrvlist= function() {
  $http.get("/api/domains",  config)
  .then(function(response) {
          console.log("Data")
          console.log(response.data)
          console.log(response.data['domains'])
          if (response.data['status'] === "Success"){
            $scope.srvs = response.data['domains'];
          }
          else{
            $scope.srvs = [] 
          }
      });
    }

  $scope.initsrvlist()

  if ($stateParams.siteId){
    console.log($stateParams.siteId)
    $scope.servername = $stateParams.siteId
    $scope.isSiteSelected = true
  }
  else{
    $scope.isSiteSelected = false
  }

$scope.srvs =  $rootScope.ftp_srvs

$rootScope.getFTPSiteDetails = $scope.getFTPSiteDetails = function() {
  $http.post("/api/ftp", { "site": $stateParams.siteId }, { headers : {'Content-Type' : 'application/json'} })
  .then(function(response) {
          $scope.ftp_data = response.data['results']
      });
  };

  if  ($stateParams.siteId){
    $scope.getFTPSiteDetails()
  }
  
  $scope.getFTPSiteDetailsFromSelect = function() {
    $http.post("/api/ftp", { "site": ftpserver }, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
            $scope.ftp_data = response.data['results']
            $scope.servername = ftpsite
            $scope.ftpserver = ftpsite
        });
    };

  $scope.removeFTPUser = function(ftpsite, username) {
    console.log("in removeFTPUser")
    $http.delete("/api/ftp/user", {"params" : {"ftpsite":ftpsite, "username":username} })
    .then(function(response) {
            $scope.getFTPSiteDetails()
        });
  };


$scope.updateHomedir = function(username,datadir) {

  $http.put("/api/ftp/datadir", { "ftpsite": $stateParams.siteId, username:username,datadir :  datadir }, { headers : {'Content-Type' : 'application/json'} })
  .then(function(response) {

      });
};

$scope.updatePassword = function(username,password) {
  if ( password.length > 0 ){ 
  $http.put("/api/ftp/password", { "ftpsite": $stateParams.siteId, username:username,password:password }, { headers : {'Content-Type' : 'application/json'} })
  .then(function(response) {
          $scope.ftp_password = ''
      });
  }
};



    $scope.open = function (page, size) {
      $rootScope.addFTPInstance = $uibModal.open({
        animation: true,
        controller: 'AddingSiteDetailsCtrl',
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



  angular.module('BlurAdmin.pages.tables')
  .controller('DomainCtrl', DomainCtrl);

/** @ngInject */  


function DomainCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {

  $scope.addDomain = function(ftpsite,ftpsite_alias) {
    $scope.inserted = {
      name: ftpsite,
      alias: ftpsite_alias,
      status: 3,
      group:  3
    };
    console.log($scope.inserted)
    $rootScope.modalInstance.close('a');
    $http.post("/api/domain", $scope.inserted, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
            $rootScope.retrieveFTPDomains()
        });
  };

}


  angular.module('BlurAdmin.pages.tables')
      .controller('TablesPageCtrl', TablesPageCtrl);

  /** @ngInject */  

  function TablesPageCtrl($rootScope, $scope, $http, $filter, $uibModal, localStorage, editableOptions, editableThemes) {


    var UserData = {
      username: localStorage.getObject('dataUser')["username"],
    };

    var config = {
      params: UserData,
      headers : {'Accept' : 'application/json'}
     };

    console.log(localStorage.getObject('dataUser')["username"])

    $rootScope.retrieveFTPDomains = $scope.retrieveFTPDomains = function () {
    $http.get("/api/domains",  config)
    .then(function(response) {
            if (response.data['status'] === "Success"){
              $scope.domains = response.data['domains'];
              console.log($scope.domains)
            }
            else{
              $scope.domains = [] 
            }
            $rootScope.ftp_srvs  = $scope.domains ;
        });
    };

    $scope.retrieveFTPDomains()

    $scope.open = function (page, size) {
      $rootScope.modalInstance = $uibModal.open({
        animation: true,
        controller: 'DomainCtrl',
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
      headers : {'Accept' : 'application/json'}
     };


    $http.get("/api/domains",  config)
    .then(function(response) {
            if (response.data['status'] === "Success"){
              $scope.domains = response.data['domains'];
            }
            else{
              $scope.domains = [] 
            }
        });

    $scope.smartTableData = [
      {
        id: 1,
        firstName: 'Mark',
        lastName: 'Otto',
        username: '@mdo',
        email: 'mdo@gmail.com',
        age: '28'
      }
    ];

    $scope.editableTableData = $scope.smartTableData.slice(0, 36);

    $scope.peopleTableData = [
      {
        id: 1,
        firstName: 'Mark',
        lastName: 'Otto',
        username: '@mdo',
        email: 'mdo@gmail.com',
        age: '28',
        status: 'info'
      }
    ];

    $scope.users = [
      {
        "id": 1,
        "name": "Esther Vang",
        "status": 4,
        "group": 3
      }
    ];

    $scope.statuses = [
      {value: 1, text: 'Good'},
      {value: 2, text: 'Awesome'},
      {value: 3, text: 'Excellent'},
      {value: 4, text: 'active'}
    ];

    $scope.groups = [
      {id: 1, text: 'user'},
      {id: 2, text: 'customer'},
      {id: 3, text: 'vip'},
      {id: 4, text: 'admin'},
      {id: 5, text: 'webfutur'}
    ];

    $scope.showGroup = function(user) {
      if(user.group && $scope.groups.length) {
        var selected = $filter('filter')($scope.groups, {id: user.group});
        return selected.length ? selected[0].text : 'Not set';
      } else return 'Not set'
    };

    $scope.showStatus = function(user) {
      var selected = [];
      if(user.status) {
        selected = $filter('filter')($scope.statuses, {value: user.status});
      }
      return selected.length ? selected[0].text : 'Not set';
    };


    $scope.removeUser = function(index) {
      $scope.users.splice(index, 1);
    };

    $scope.removeFTPSite = function(ftpsite) {
      //console.log(index)
      //$scope.domains.splice(index, 1);
      $http.delete("/api/domain", {"params" : {"ftpsite":ftpsite} })
      .then(function(response) {
              $scope.retrieveFTPDomains()
          });
    };

    $scope.addUser = function() {
      $scope.inserted = {
        id: $scope.users.length+1,
        name: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
    };


    $scope.addDomain = function(ftpsite) {
      $scope.inserted = {
        id: $scope.domains.length+1,
        name: ftpsite,
        status: 3,
        group:  3
      };
      $scope.domains.push($scope.inserted);
      //$uibModal.dismiss('close');
      $scope.myModal.dismiss();
    };

    $scope.checkName = function(data) {
      if (data !== 'awesome' && data !== 'error') {
        return "Username should be `awesome` or `error`";
      }
    };
  
    $scope.saveDomain = function(name, data) {
      // $scope.user already updated!
      $http.put("/api/domain", {"domain_name":name, "data": data}, { headers : {'Content-Type' : 'application/json'} })
      .then(function(response) {
          });

    };



    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


  }

})();
