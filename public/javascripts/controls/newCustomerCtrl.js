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

    vm.init = function() {
      vm.contacts = [];
      vm.contacts[0] = {
        firstName : "", 
        lastName : "", 
        title : "",
        phone : "",
        email : ""
      };
    };

    vm.addContact = function() {
      vm.contacts.push({
        firstName : "", 
        lastName : "", 
        title : "",
        phone : "",
        email : ""
      });    
      console.log("Contact added", vm.contacts)
    };

    vm.removeContact = function (index) {
      vm.contacts.splice(index, 1);
    };

    vm.clear = function() {
      vm.customer = {};
      vm.contacts = [];

      console.log(vm.contacts);
    }

    vm.addAlert = function(type, msg) {
      vm.alerts.push({
        type: type,
        msg: msg
      });
    };

    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

    vm.submit = function(user) {
      console.log("User ", user.userName, " created this account.")  ;
      var data = {
        "companyName":vm.customer.companyName,
        "addressLine1":vm.customer.addressLine1,
        "addressLine2":vm.customer.addressLine2, 
        "firstName":vm.customer.firstName, 
        "lastName":vm.customer.lastName, 
        "city":vm.customer.city,
        "province":vm.customer.province,
        "postal":vm.customer.postal,
        "contacts": vm.contacts,
        "businessPhone": vm.customer.businessPhone,
        "businessFax": vm.customer.businessFax
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
