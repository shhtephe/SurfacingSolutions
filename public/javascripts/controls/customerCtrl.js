(function() {
	'use strict';
	angular
	.module('surfacingSolutions')
	.controller('customerCtrl', customerCtrl);

	customerCtrl.$inject = ['dataFactory', '$stateParams'];

	function customerCtrl(dataFactory, $stateParams) {
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
		//I think this was originally to create a new quote through angular. Might not use it.
		/*vm.newQuote = function(quotes, custCode){
			var max = Math.max.apply(null, quotes.map(function(item){
			   return item["quoteID"];
			}));

			if(max > 0){
				max ++;
			}
			else {
				max = 1;
			}
			console.log(max);
			console.log(custCode);
			var path = "/customer/" + custCode + "/quote/" + max;

			$location.path( path );
			};
		}; */  
	};
}());