(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('customerCtrl', customerCtrl);

	customerCtrl.$inject = ['dataFactory', '$stateParams', '$location'];

	function customerCtrl(dataFactory, $stateParams, $location) {
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
				console.log(item);
			   return item["quoteID"];
			}));
			console.log(max);
			if(max > 0){
				max ++;
			}
			else {
				max = 1;
			}
			//console.log(max);
			//console.log($stateParams.custCode);
			var path = "/customer/" + $stateParams.custCode + "/quotebuild/" + max;
			//console.log(path);

			$location.path( path );
		};
	}; 
}());