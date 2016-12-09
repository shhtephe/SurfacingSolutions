(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('registerCtrl', registerCtrl);

	registerCtrl.$inject = ['$scope','$http'];

	function registerCtrl($scope, $http) {
		var vm = this;

		vm.alerts = [];

		//set option to 'user'
		//$scope.userForm.accountType = 'user';

		vm.submit = function(form, user){
			if(user.accountType !== "admin" && form.accountType === "admin" ) {
				vm.addAlert("warning", "Standard user cannot create an admin account.");
			} else if(user.accountType === "admin" || form.accountType === "user"){
				var data = {
					username:form.userName, 
					accountType:form.accountType,
					email:form.email, 
					phoneNumber:form.phoneNumber,
					password:form.password
				};

				$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
				$http.post('/register', {"data":data}).
		  		success(function(data, status, headers, config) {
			    	// this callback will be called asynchronously
			    	// when the response is available
			    	vm.addAlert("success","New User has been created!");
			  	}).
		  		error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					vm.addAlert("danger", data.error);
		  		});
			};
		};
		vm.addAlert = function(type, msg) {
	      vm.alerts.push({
	        type: type,
	        msg: msg
	      });
	    };
	   	vm.closeAlert = function(index) {
		    vm.alerts.splice(index, 1);
	  	};
	};	
}());