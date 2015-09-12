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

    $scope.newCustomer = function(a, b, c, d, e, f, g, h, i, j, k) {  
      var data = {
        "firstName":a, 
        "lastName":b, 
        "companyName":c, 
        "email":d, 
        "addressLine1": e,
        "addressLine2": f,
        "city": g,
		    "postal":h,
        "province":i,
		    "homePhone":j,
		    "mobilePhone":k
      };
      console.log(data);

      $http.post('/newcustomer', data).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.addAlert("success","New Customer has been saved!");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.addAlert("danger","Error: New Customer could not be saved.");
      });
    }
}]);