'use strict';

app.controller('newCustomerCtrl', 
  ['$scope', '$http', function ($scope, $http) {
    $scope.alerts = [
    ];

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({
        type: type,
        msg: msg
      });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.newCustomer = function(a, b, c, d, e, f, g, h) {  
      var data = {
        "firstName":a, 
        "lastName":b, 
        "companyName":c, 
        "email":d, 
        "addressLine1": e,
		"postal":f,
		"homePhone":g,
		"mobilePhone":h
      };
      $http.post('/newcustomer', data).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        addAlert("success","New Customer has been saved!");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        addAlert("danger","Error: New Customer could not be saved.");
      });
    }
}]);