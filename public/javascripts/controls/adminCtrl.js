'use strict';

app.controller('adminCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.alerts = [
  	];

  function arraySearch(nameKey, myArray){
      for (var i=0; i < myArray.length; i++) {
          if (myArray[i]._id === nameKey) {
              return i;
          };
      };
  };

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

  $scope.showEditMaterial = function(){
    $scope.newEditMaterial = true;
    $scope.editDistributor = "";
    $scope.editManufacturer = "";
    $scope.editColourGroup = "";
    $scope.editDescription = "";
  }

	$scope.showNewMaterial = function(){
		$scope.newMaterial = true;
    $scope.newMaterialName = "";
    $scope.newMaterialPrice = "";
    $scope.newMaterialColourGroup = "";
	}

  $scope.cancelSaveMaterial = function(){
    $scope.newEditMaterial = false;
    $scope.editDistributor = "";
    $scope.editManufacturer = "";
    $scope.editColourGroup = "";
    $scope.editDescription = "";
  }


  $scope.saveNewMaterial = function(materials, tempMaterials, newDescription){

    var material = {
      manufacturer : newDescription.manufacturer,
      distributor : newDescription.distributor,
      description : newDescription.description,
      itemCode : newDescription.itemCode,
      colourGroup : newDescription.colourGroup,
      thickness : newDescription.thickness,
      length : newDescription.length,
      width : newDescription.width,
      fullSheet1 : newDescription.fullSheet1,
      halfSheet : newDescription.halfSheet,
      fullSheet5 : newDescription.fullSheet5,
      fullSheet21 : newDescription.fullSheet21
    };
    materials.push(material);
    tempMaterials = materials;
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

  $scope.deleteMaterial = function(materials, editDescription){
    var spliceIndex = arraySearch(editDescription._id, materials)
    //delete item
    materials.splice(spliceIndex, 1);
    $scope.editDistributor = "";
    $scope.editManufacturer = "";
    $scope.editColourGroup = "";
    $scope.editDescription = "";
  };

  $scope.saveMaterial = function(materials, tempMaterials, editDescription){
    console.log(materials);
    console.log(editDescription);
    //declaring json data
    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
    $http.post('/savematerial', {"materials":materials, "material":editDescription}).
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