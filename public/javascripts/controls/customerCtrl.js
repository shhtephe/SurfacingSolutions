(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('customerCtrl', customerCtrl);

	customerCtrl.$inject = ['dataFactory', '$stateParams', '$location', '$mdDialog', '$http'];

	function customerCtrl(dataFactory, $stateParams, $location, $mdDialog, $http) {
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
		//I think this was originally to create a new quote through angular.
		vm.newQuote = function(currentUser){
			//New Quote
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