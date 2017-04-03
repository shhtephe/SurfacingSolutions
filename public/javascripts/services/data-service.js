(function() {
	'use strict';
	angular.module('surfacingSolutions').factory('dataFactory', dataFactory);

	dataFactory.$inject = ['$http', '$q', '$rootScope'];

	function dataFactory($http, $q, $rootScope) {
		return {
			getCustomers: getCustomers,
			getCustomer: getCustomer,
			getProductsMaterials: getProductsMaterials,
			getQuote: getQuote,
			getAccounts: getAccounts,
			getQuotes: getQuotes,
			getRemnants: getRemnants
		};

		function getCustomers() {
			var deferred = $q.defer();
			//console.log("This has ran")
			$http.get('/customersdata')
				.success(function(response) {
					deferred.resolve(response);
					// update angular's scopes
                 	$rootScope.$$phase || $rootScope.$apply();
				})
			return deferred.promise;
		};

		function getRemnants() {
			var deferred = $q.defer();
			$http.get('/remnants')
				.success(function(response) {
					deferred.resolve(response);
					// update angular's scopes
                 	$rootScope.$$phase || $rootScope.$apply();
				})
			return deferred.promise;
		};


		function getCustomer(custCode) {
			var deferred = $q.defer();
			$http.get('/customerdata/' + custCode)
				.success(function(response) {
					deferred.resolve(response);
					// update angular's scopes
                 	$rootScope.$$phase || $rootScope.$apply();
			});
			return deferred.promise;
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

		function getQuotes() {
			return $http.get('/quotesdata')
			.then(function(response) {
				return response.data;
			});
		};

		function getAccounts() {
			return $http.get('/accountdata')
			.then(function(response) {
				return response.data;
			});
		};
	};		
}());