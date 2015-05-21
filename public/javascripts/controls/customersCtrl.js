'use strict';

app.controller('customersCtrl', 
  ['$scope', '$state', function ($scope, $state) {
  	$scope.alerts = [
  	];
	$scope.init = function() {
		console.log($scope.customers);
		if (typeof $scope.customers === "undefined" || $scope.customers == "") {
	    	$scope.alerts.push({
				type: "warning",
		    	msg: "There are no customers. Head to Quote-->New Customers to add a new customer"
		    });
		};
	};
	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};
}]);