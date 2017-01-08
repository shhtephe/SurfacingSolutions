(function() {
	'use strict';
	angular.module('surfacingSolutions').factory('dataFactory', dataFactory);

	dataFactory.$inject = ['$http'];

	function dataFactory($http) {
		return {
			getCustomers: getCustomers,
			getCustomer: getCustomer,
			getProductsMaterials: getProductsMaterials,
			getQuote: getQuote
		};

		function getCustomers() {
			return $http.get('/customersdata')
			.then(function(response) {
				return response.data;
			});
		};

		function getCustomer(custCode) {
			return $http.get('/customerdata/' + custCode)
			.then(function(response) {
				return response.data;
			});
		};
		function getProductsMaterials() {
			return $http.get('/admindata')
			.then(function(response) {
				return response.data;
			});
		};
		function getQuote(custCode, quoteID) {
			return $http.get('/customer/' + custCode + '/quotedata/' + quoteID)
			.then(function(response) {
				return response.data;
			});
		};
	};
/*,
			getProducts: getProducts,
			getMaterials: getMaterials*/
		
}());