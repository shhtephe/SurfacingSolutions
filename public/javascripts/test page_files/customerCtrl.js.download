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
		vm.newQuote = function(){
			var max = Math.max.apply(null, vm.quotes.map(function(item){
				console.log("Item:", item);
			   return item["quoteID"];
			}));
			console.log("Max quote ID: ", max);
			if(max > 0){
				max ++;
			}
			else {
				max = 1;
			}
			//console.log(max);
			//console.log($stateParams.custCode);
			var path = "/customer/" + $stateParams.custCode + "/quotebuild/" + max;
			console.log(path);

			$location.path( path );
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
			    	vm.quotes.splice(index, index+1);
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