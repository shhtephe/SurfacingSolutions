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
  }

	$scope.showNewMaterial = function(){
		$scope.newMaterial = true;
    $scope.newMaterialName = "";
    $scope.newMaterialPrice = "";
    $scope.newMaterialColourGroup = "";
	}

  $scope.saveNewMaterial = function(group, colour, price){
    
    $scope.newMaterialColour = "";
    $scope.newMaterialPrice = "";
    $scope.newMaterialColourGroup = "";

    var newMaterial = {
      colourGroup: group,
      colour: colour,
      price: price
    };
    $scope.materials.push(newMaterial);  
    console.log($scope.materials);

    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

    $http.post('/savenewmaterial', {"materials":$scope.materials}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available      
      $scope.addAlert("success", "Materials Saved Successfully");
      console.log(data);
      //$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.addAlert("danger", "Error: Materials did not save");
    });
  };

	$scope.saveProducts = function(products, index){
  	console.log(products);
    console.log(index);


    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  	/*$http.post('/saveproduct', {"products":products, products[index]}, ).
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
*/
	};
}]);