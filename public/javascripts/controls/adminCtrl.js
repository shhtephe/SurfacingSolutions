'use strict';

app.controller('adminCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.alerts = [
  	];

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({
      type: type,
      msg: msg
    });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.hideNewMaterial = function(){
    $scope.newMaterial = false;
    $scope.colourGroup = "";
    $scope.materialName = "";
    $scope.materialPrice = "";
  }

	$scope.showNewMaterial = function(){
		$scope.newMaterial = true;
	}

  $scope.saveNewMaterial = function(group, colour, price){
    var materials = {
      colourGroup: group,
      colour: colour,
      price: price
    };
    console.log(materials);

    $http.post('/savenewmaterial', {"materials":materials}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available      
      $scope.addAlert("success", "Materials Saved Successfully");
      //$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.addAlert("danger", "Error: Materials did not save");
    });
  };

	$scope.saveProducts = function(products){
  	console.log(products);
  	$http.post('/saveproduct', {"products":products}).
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
	};
}]);