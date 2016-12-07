(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('registerCtrl', registerCtrl);

	registerCtrl.$inject = ['dataFactory', '$stateParams', '$location', '$mdDialog', '$http'];

	function registerCtrl(dataFactory, $stateParams, $location, $mdDialog, $http) {
		var vm = this;
		vm.submit = function(form, user){
			if(user.accountType === "user" && form.accountType === "admin") {
				vm.addAlert("warning", "Standard user cannot create an admin account.");
			} else if(user.accountType === "admin"){

				data = {
					username:form.userName, 
					accountType:form.accountType,
					email:form.email, 
					phoneNumber:form.phoneNumber
				};



				$http.post('/customers/create', data).
		        success(function(data, status, headers, config) {
			        // this callback will be called asynchronously
			        // when the response is available
			        vm.addAlert("success","New User has been saved!");
		      	}).
		    	error(function(data, status, headers, config) {
		    		// called asynchronously if an error occurs
			        // or server returns response with an error status.
			        vm.addAlert("danger","Error: New Customer could not be saved. \n" + data);
		    	});
			};
		};
	};	

	vm.addAlert = function(type, msg) {
      vm.alerts.push({
        type: type,
        msg: msg
      });
    };
}());