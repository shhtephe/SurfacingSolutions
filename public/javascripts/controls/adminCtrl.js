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

  $scope.saveNewMaterial = function(materials, group, colour, price){

    var material = {
      colourGroup:group,
      colour:colour,
      price:price
    };
    materials.push(material);
    console.log(materials);
    console.log(material);

    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
    
    $http.post('/savenewmaterial', {"materials":material}).
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

    //clear dropdowns
    $scope.newMaterialColour = "";
    $scope.newMaterialPrice = "";
    $scope.newMaterialColourGroup = "";
  };

  $scope.saveMaterial = function(materials, materialColour){
    console.log(materials);
    console.log(materialColour);
    //declaring json data
    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
    $http.post('/savematerial', {"materials":materials, "material":materialColour}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.addAlert("success", "Material saved Successfully");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.addAlert("danger", "Error: Material did not save");
    });
  };

	$scope.saveProducts = function(products, product){
  	console.log(products);
    console.log(product);


    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  	$http.post('/saveproduct', {"product":product}).
  		success(function(data, status, headers, config) {
      	// this callback will be called asynchronously
      	// when the response is available
      	$scope.addAlert("success", "Product saved Successfully");
    	}).
  		error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.addAlert("danger", "Error: Product did not save");
		});
	};
}]);