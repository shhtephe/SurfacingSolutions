(function() {
	'use strict';

	angular
		.module('surfacingSolutions')
		.controller('customersCtrl', customersCtrl);

	customersCtrl.$inject = ['dataFactory'];

	function customersCtrl(dataFactory) {
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
	  	//set Sort type on
	  	vm.sortType = "updatedAt";
	  	vm.sortReverse = !vm.sortReverse;
	  	
	  	vm.buildCustomer = function(customer) {
	  		var response = "";
	  		//console.log(customer)
	  		if(customer.companyName !=="") {
	  			response += (customer.companyName + " - ");
	  		};
	  		//handles old contact style
	  		if (typeof customer.firstName == 'undefined') {
  				var contact = {
  					firstName : customer.contacts[0].firstName,
  					lastName : customer.contacts[0].lastName,
  					email : customer.contacts[0].email, 
  				};
  			} else {
  				var contact = {
  					firstName : customer.firstName,
  					lastName : customer.lastName,
  					email : customer.email, 
  				};
  			};
	  		if (contact.lastName !=="" && contact.firstName !=="") {
	  			response += (contact.lastName + ", " + contact.firstName);
	  		} else if(contact.lastName !==""){
	  			response += (contact.lastName);
	  		} else if (contact.firstName !==""){
				response += (contact.firstName);
	  		};
	  		return response;
	  	};

	  	vm.buildCustName = function(customer) {
	  		var response = "";
  			//console.log(vm.customers);
			var search = vm.arraySearch(customer, vm.customers, 'custCode');
			//console.log(typeof vm.customers[search]);
			if(typeof vm.customers[search] !== 'undefined') {
				response = vm.customers[search].companyName;
		  		return response;
			};
	  	};

	  	vm.arraySearch = function (nameKey, myArray, property){
		    //console.log("myArray." + property + "=" + nameKey);
		    //console.log(myArray);
		    for (var i=0; i < myArray.length; i++) {
		    	//console.log("my array i", myArray[i], "property", property)
		        if (myArray[i][property] === nameKey) {
		            return i;
		        };
		    };
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
