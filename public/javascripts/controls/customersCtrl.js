'use strict';

app.controller('customersCtrl', 
  ['$scope', '$state', function ($scope, $state) {
  	$scope.alerts = [
  	];
	var init = function() {
		if (typeof $scope.customers === "undefined") {
	    	$scope.alerts.push({
				type: "warning",
		    	msg: "There are no customers. Head to Quote-->New Customers to add a new customer"
		    });
		};
	};
	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};
  	init();
}]);