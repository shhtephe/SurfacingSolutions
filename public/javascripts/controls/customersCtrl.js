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
			  	vm.init(data);
	  		},
	  		function(reason) {
  				console.log(reason);
	  		});
	  	dataFactory.getQuotes()
	  		.then(function(data) {
	  			vm.quotes = data;
	  		},
	  		function(reason) {
  				console.log(reason);
	  		});	
	  	vm.alerts = [
	  	];

	  	vm.buildCustomer = function(customer) {
	  		var response = "";
	  		if(customer.companyName !=="") {
	  			response += (customer.companyName + " - ");
	  		};
	  		if (customer.lastName !=="" && customer.firstName !=="") {
	  			response += (customer.lastName + ", " + customer.firstName);
	  		} else if(customer.lastName !==""){
	  			response += (customer.lastName);
	  		} else if (customer.firstName !==""){
				response += (customer.firstName);
	  		};
	  		if(customer.email !=="") {
				response += (" - " + customer.email);
	  		};
	  		return response;
	  	};

	  	vm.arraySearch = function (nameKey, myArray, property){
		    //console.log("myArray." + property + "=" + nameKey);
		    for (var i=0; i < myArray.length; i++) {
		    	//console.log("my array i", myArray[i], "property", property)
		        if (myArray[i][property] === nameKey) {
		            return i;
		        };
		    };
		};

	  	vm.buildCustName = function(customer) {
	  		var response = "";
	  			//console.log(vm.customers);
				var search = vm.arraySearch(customer, vm.customers, 'custCode');
				//console.log(search)
				response = vm.customers[search].companyName;
	  		return response;
	  	};

		vm.init = function(customers) {
			//console.log("customers: ", customers[0]);
			if (typeof customers === undefined || customers[0] === undefined) {
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
