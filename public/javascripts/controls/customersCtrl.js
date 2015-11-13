(function() {
	'use strict';

	angular
		.module('surfacingSolutions')
		.controller('customersCtrl', customersCtrl);

	customersCtrl.$inject = ['dataFactory', '$scope'];

	function customersCtrl(dataFactory, $scope) {
	  	var vm = this;
	  	dataFactory.getCustomers()
	  		.then(function(data) {
	  			vm.customers = data;
	  		},
	  		function(reason) {
  				console.log(reason);
	  		});

	  	vm.alerts = [
	  	];
		$scope.init = function() {
			console.log("This ran");
			if (typeof vm.customers === "undefined" || vm.customers === "") {
		    	vm.alerts.push({
					type: "warning",
			    	msg: "There are no customers. Head to Quote-->New Customers to add a new customer"
			    });
			};
		};
		vm.closeAlert = function(index) {
	    	vm.alerts.splice(index, 1);
	  	};
	};
}());
