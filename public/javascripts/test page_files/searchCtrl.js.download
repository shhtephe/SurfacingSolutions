'use strict';

app.controller('searchCtrl', 
  ['$scope', '$http', function ($scope, $http) {
    $scope.search = function(a, b, c, d) {  
      var data = {
        "firstName":a, "lastName":b, "companyName":c, "email":d
      };
      $http.post('/search', data).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
}]);