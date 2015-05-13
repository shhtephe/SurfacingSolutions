'use strict';

app.controller('adminCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.alerts = [
  	];

  	$scope.showNewMaterial = function(){
  		$scope.newMaterial = true;
  		console.log("well I did my part");
  	}

  	$scope.save = function(products){
		console.log(products);
		$http.post('/admin', {"quote":quote}).
  		success(function(data, status, headers, config) {
    	// this callback will be called asynchronously
    	// when the response is available
    	$scope.addAlert("success", "Saved Successfully");
	  	}).
  		error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
		$scope.addAlert("danger", "Error: Changes did not save");
  		});
  	}

  	$scope.addAlert = function(type, msg) {
	    $scope.alerts.push({
	    	type: type,
	    	msg: msg
	    });
  	};

  	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
  	};
}]);