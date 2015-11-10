(function() {
	'use strict';
	angular.module('surfacingSolutions').factory('dataFactory', dataFactory);

	dataFactory.$inject = ['$http'];

	function dataFactory($http) {
		return {
			getCustomers: getCustomers,
			getCustomer: getCustomer,
			getProducts: getProducts,
			getMaterials: getMaterials,
			getQuote: getQuote
		};

		function getCustomers() {
			return $http.get('/custdata')
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
		function getProducts() {
			return $http.get('/singlecustdata')
			.then(function(response) {
				return response.data;
			});
		};
		function getMaterials() {
			return $http.get('/singlecustdata')
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