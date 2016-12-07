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

    vm.submit = function(customer, user) {
      console.log("User ", user.userName, " created this account.")  ;
      var data = {
        "firstName":customer.firstName, 
        "lastName":customer.lastName, 
        "companyName":customer.companyName, 
        "email":customer.email, 
        "addressLine1":customer.addressLine1,
        "addressLine2":customer.addressLine2,
        "city":customer.city,
        "postal":customer.postal,
        "province":customer.province,
        "mainPhone":customer.mainPhone,
        "mobilePhone":customer.mobilePhone
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
