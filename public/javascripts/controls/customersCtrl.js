(function() {
'use strict';

angular
	.module('surfacingSolutions')
	.controller('customersCtrl', customersCtrl);

	customersCtrl.$inject = ['dataFactory'];

	function customersCtrl(dataFactory) {
	  	var vm = this;
		console.log();
	  	dataFactory.getCustomers()
	  		.then(function(data) {
	  			vm.customers = data;
	  		},
	  		function(reason) {
  				console.log(reason);
	  		});


	  	vm.alerts = [
	  	];
		vm.init = function() {
			if (typeof vm.customers === "undefined" || vm.customers == "") {
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
