(function() {
  'use strict';

  angular
    .module('surfacingSolutions')
    .controller('newCustomerCtrl', newCustomerCtrl);

    newCustomerCtrl.$inject = ['$http'];

  function newCustomerCtrl ($http) {
    
    var vm = this;

    vm.alerts = [
    ];

    vm.addAlert = function(type, msg) {
      vm.alerts.push({
        type: type,
        msg: msg
      });
    };

    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

    vm.submit = function(a, b, c, d, e, f, g, h, i, j, k) {  
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
      //console.log(data);

      $http.post('/customers/create', data).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        vm.addAlert("success","New Customer has been saved!");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        vm.addAlert("danger","Error: New Customer could not be saved.");
      });
    };
  };
}());
