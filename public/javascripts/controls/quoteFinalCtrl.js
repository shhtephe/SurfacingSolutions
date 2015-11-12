(function() {
	'use strict';

	angular
		.module('surfacingSolutions')
		.controller('quoteFinalCtrl', quoteFinalCtrl);

	quoteFinalCtrl.$inject = ['dataFactory', '$stateParams'];

	function quoteFinalCtrl (dataFactory, $stateParams) {
		var vm = this;
		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;

		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.customer = data.customer;
			},
			function(reason) {
				console.log(reason);
			});
	};
}());