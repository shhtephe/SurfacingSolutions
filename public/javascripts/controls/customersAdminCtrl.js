(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('customersAdminCtrl', customersAdminCtrl);

	customersAdminCtrl.$inject = ['dataFactory', '$http'];

	function customersAdminCtrl(dataFactory, $http) {
		var vm = this;
		/*
			Customers Control
		*/
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

	  	vm.alerts = [];
	  	
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
				//console.log(search)
				response = vm.customers[search].companyName;
	  		return response;
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

			vm.contacts = [];
		    vm.contacts[0] = {
		    	firstName : "", 
		        lastName : "", 
		        title : "",
		        phone : "",
		        email : ""
		    };
		};
		vm.closeAlert = function(index) {
	    	vm.alerts.splice(index, 1);
	  	};

	  	/*
			New Customer Control
	  	*/

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