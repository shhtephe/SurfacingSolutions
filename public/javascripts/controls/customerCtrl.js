(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('customerCtrl', customerCtrl);

	customerCtrl.$inject = ['dataFactory', '$stateParams', '$location', '$mdDialog', '$http', '$uibModal'];

	function customerCtrl(dataFactory, $stateParams, $location, $mdDialog, $http, $uibModal) {
		var vm = this;
		var custCode = $stateParams.custCode;
		dataFactory.getCustomer(custCode)
			.then(function(data) {
				vm.quotes = data.quotes;
				vm.customer = data.customer;
			},
			function(reason) {
				console.log(reason);
			});

		//add Contact Modal
		vm.addContact = function (contacts) {
			//console.log(groupIndex, counters, size);
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'addContact.html',
		      controller: ['$uibModalInstance', addContactCtrl],
		      controllerAs: 'vm',
		      resolve: {
		        contacts: function() {return contacts}
		        }
      	  	});

      	  	modalInstance.result.then(function (contacts) {
      			//Save the contact and put all the data back onto the main controller
      			vm.pushContact(contacts);  			 				
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    //Contact modal Controller
	    var addContactCtrl = function($uibModalInstance) {
	    	var vm = this;

	    	vm.submitContact = function(contact) {
	    		$uibModalInstance.close(contact);
	    	};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    };

	    //Edit Customer Modal
	    vm.editCustomer = function (customer) {
			//console.log(groupIndex, counters, size);
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'editCustomer.html',
		      controller: ['$uibModalInstance', 'customer', editCustomerCtrl],
		      controllerAs: 'vm',
		      resolve: {
		        customer: function() {return customer}
		        }
      	  	});

      	  	modalInstance.result.then(function (customer) {
      			//Save the contact and put all the data back onto the main controller
      			vm.saveEditCustomer(customer);  			 				
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    //Edit Custeomr modal Controller
	    var editCustomerCtrl = function($uibModalInstance, customer) {
	    	console.log($uibModalInstance, customer);
	    	var vm = this;
	    	vm.customer = customer;
	    	//convert legacy contacts
	    	if (vm.customer.firstName) {
	    		console.log("Legacy Contacts found");
	    		if(!vm.customer.mainPhone) {
					vm.customer.mainPhone = vm.customer.mobilePhone;
				};
				var newCustomer = {
				  createdAt: vm.customer.createdAt,
				  updatedAt: vm.customer.updatedAt,
				  companyName: vm.customer.companyName,
				  addressLine1: vm.customer.addressLine1,
				  city: vm.customer.city,
				  province: vm.customer.province,
				  postal: vm.customer.postal,
				  businessPhone: vm.customer.businessPhone,
				  custCode: vm.customer.custCode,
				  contacts: [
				  	{
				  		firstName: vm.customer.firstName,
				  		lastName: vm.customer.lastName,
				  		title: "",
				  		phone: vm.customer.mainPhone,
				  		email: vm.customer.email,
				  	}
				  ]
		  		};

	  			vm.customer = newCustomer;
	  			console.log(vm.customer)
	    	};

	    	vm.submitEdit = function(customer) {
	    		$uibModalInstance.close(customer);
	    	};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    };

		vm.saveEditCustomer = function(customer) {
			console.log(customer);
			vm.saveCustomer(vm.customer, "update");
		};

		vm.pushContact = function(contact){
			console.log(vm.customer.firstName)
			//refactor old contact format into new
			if (vm.customer.firstName) {
				console.log("Legacy contact found.")
				if(!vm.customer.mainPhone) {
					vm.customer.mainPhone = vm.customer.mobilePhone;
				};

				var newCustomer = {
				  createdAt: vm.customer.createdAt,
				  updatedAt: vm.customer.updatedAt,
				  companyName: vm.customer.companyName,
				  addressLine1: vm.customer.addressLine1,
				  city: vm.customer.city,
				  province: vm.customer.province,
				  postal: vm.customer.postal,
				  businessPhone: vm.customer.businessPhone,
				  custCode: vm.customer.custCode,
				  contacts: [
				  	{
				  		firstName: vm.customer.firstName,
				  		lastName: vm.customer.lastName,
				  		title: "",
				  		phone: vm.customer.mainPhone,
				  		email: vm.customer.email,
				  	}
				  ]
		  		};

	  			vm.customer = newCustomer;
	  			console.log(vm.customer);
	  			vm.customer.contacts.push(contact);
	  			console.log(vm.customer);
	  			vm.saveCustomer(vm.customer, "replace");
			} else {
				vm.customer.contacts.push(contact);
				vm.saveCustomer(vm.customer, "update");
			};
		};

		vm.removeContact = function(index) {
			console.log("Removed Contact " + index);
			vm.customer.contacts.splice(index, 1);
			vm.saveCustomer(vm.customer, "update");
			if(vm.customer.contacts.length < 2) {
				vm.isContactCollapsed = false;
			}
		};

		vm.saveCustomer = function(customer, action) {
			//Need to declare that it's sending a json doc
			$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
			$http.post('/savecustomer', {customer : customer, action : action}).
	  		success(function(data, status, headers, config) {
		    	// this callback will be called asynchronously
		    	// when the response is available
		    	console.log("Customer saved, probably");
		  	}).
	  		error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				vm.addAlert("danger", "Could not create new quote: ", data);
	  		});
		};

		vm.newQuote = function(){
			//Need to declare that it's sending a json doc
			$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
			$http.post('/newquote', {customer : vm.customer}).
	  		success(function(data, status, headers, config) {
		    	// this callback will be called asynchronously
		    	// when the response is available
		    	var path = "/customer/" + $stateParams.custCode + "/quotebuild/" + data.quoteID
		    	console.log(path);
		    	$location.path( path );
		  	}).
	  		error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				vm.addAlert("danger", "Could not create new quote: ", data);
	  		});
		};

		vm.alerts = [];

	  	vm.addAlert = function(type, msg) {
		    vm.alerts.push({
		    	type: type,
		    	msg: msg
		    });
	  	};

	  	vm.closeAlert = function(index) {
		    vm.alerts.splice(index, 1);
	  	};

	  	//nameKey = string to find | myArray = the array | property = which property to find it in)
		vm.arraySearch = function (nameKey, myArray, property){
		    //console.log(nameKey, myArray, property);
		    for (var i=0; i < myArray.length; i++) {
		    	//console.log("my array i", myArray[i], "property", property)
		        if (myArray[i][property] === nameKey) {
		            return i;
		        };
		    };
		};

		vm.removeQuote = function(quote, index, ev){
			// Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
		          .title('Delete Quote')
		          .textContent('Are you sure you want to delete this quote?')
		          .ariaLabel('Lucky day')
		          .ok('Delete')
		          .cancel('Cancel')
		          .targetEvent(ev);
			
		    $mdDialog.show(confirm).then(function() {
		      	console.log("User chose delete");
				//save the quote
				//Need to declare that it's sending a json doc
				$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
				$http.post('/removeQuote', {quote : quote, customer : vm.customer}).
		  		success(function(data, status, headers, config) {
			    	// this callback will be called asynchronously
			    	// when the response is available
			    	vm.addAlert("success", "Quote Deleted Successful");
			    	vm.quotes.splice(vm.arraySearch(quote.quoteID, vm.quotes, 'quoteID'), 1);
			  	}).
		  		error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					vm.addAlert("danger", "Error: Quote did not Delete");
		  		});
		    }, function() {
		      console.log("User Cancelled.");
			});
		};
	}; 
}());