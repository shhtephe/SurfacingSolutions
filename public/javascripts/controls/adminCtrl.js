'use strict';

app.controller('adminCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.alerts = [];

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

  $scope.hideNewProduct = function(){
    $scope.newProduct = false;
  }

  $scope.showEditMaterial = function(){
    $scope.newEditMaterial = true;
    $scope.editMaterialDistributor = "";
    $scope.editMaterialManufacturer = "";
    $scope.editMaterialColourGroup = "";
    $scope.editMaterialDescription = "";
  }

	$scope.showNewMaterial = function(){
		$scope.newMaterial = true;
    $scope.newManufacturer="",
    $scope.newDistributor="",
    $scope.materialDescription="",
    $scope.newItemCode="",
    $scope.newColourGroup="",
    $scope.newThickness="",
    $scope.newLength="",
    $scope.newWidth="",
    $scope.newFullSheet1="",
    $scope.newHalfSheet="",
    $scope.newFullSheet5="",
    $scope.newFullSheet21="";
    $scope.newisa="",
    $scope.newCollection="";
	}

  $scope.cancelSaveMaterial = function(){
    $scope.newEditMaterial = false;
    $scope.editMaterialDistributor = "";
    $scope.editMaterialManufacturer = "";
    $scope.editMaterialColourGroup = "";
    $scope.editMaterialDescription = "";
    $scope.tempMaterials = $scope.materials;
  }

  $scope.showEditProduct = function(){
    $scope.newEditProduct = true;
    $scope.editProductDistributor = "";
    $scope.editProductManufacturer = "";
    $scope.editProductType = "";
    $scope.editProductdescription = "";
  }

  $scope.showNewProduct = function(){
    $scope.newProduct = true;
    $scope.newManufacturer="",
    $scope.newDistributor="",
    $scope.materialDescription="",
    $scope.newItemCode="",
    $scope.newColourGroup="",
    $scope.newThickness="",
    $scope.newLength="",
    $scope.newWidth="",
    $scope.newFullSheet1="",
    $scope.newHalfSheet="",
    $scope.newFullSheet5="",
    $scope.newFullSheet21="";
    $scope.newisa="",
    $scope.newCollection="";
  }

  $scope.cancelSaveProduct = function(){
    $scope.newEditProduct = false;
    $scope.editProductDistributor = "";
    $scope.editProductManufacturer = "";
    $scope.editProductType = "";
    $scope.editProductDescription = "";
    $scope.tempProducts = $scope.products;
  }


  $scope.addNewMaterial = function(materials, tempMaterials, materialDescription){
    console.log(materialDescription);
    var material = {
      manufacturer : materialDescription.manufacturer,
      distributor : materialDescription.distributor,
      description : materialDescription.description,
      itemCode : materialDescription.itemCode,
      colourGroup : materialDescription.colourGroup,
      thickness : materialDescription.thickness,
      length : materialDescription.length,
      width : materialDescription.width,
      fullSheet1 : materialDescription.fullSheet1,
      halfSheet : materialDescription.halfSheet,
      fullSheet5 : materialDescription.fullSheet5,
      fullSheet21 : materialDescription.fullSheet21,
      isa : materialDescription.isa,
      matCollection : materialDescription.matCollection
    };
    materials.push(material);
    $scope.tempMaterials = materials;
    console.log(materials);
    console.log(material);

    $scope.saveMaterials(materials, material, "add");
  };

  $scope.deleteMaterial = function(materials, tempMaterials, editMaterialDescription){
    console.log(editMaterialDescription);

    var index = arraySearch(editMaterialDescription._id, materials)
    //delete item
    materials.splice(index, 1);

    $scope.editMaterialDistributor = "";
    $scope.editMaterialManufacturer = "";
    $scope.editMaterialColourGroup = "";
    $scope.editMaterialDescription = "";
    
    //commit changes to database
    $scope.saveMaterials(materials, "", "delete", editMaterialDescription._id);
  };

  $scope.updateMaterial = function(materials, tempMaterials, editMaterialDescription){
    console.log(materials);
    console.log(editMaterialDescription);

    var index = arraySearch(editMaterialDescription._id, tempMaterials);
    console.log(index);

    materials[index].itemCode = editMaterialDescription.itemCode,
    materials[index].thickness = editMaterialDescription.thickness,
    materials[index].length = editMaterialDescription.length,
    materials[index].width = editMaterialDescription.width,
    materials[index].fullSheet1 = editMaterialDescription.fullSheet1,
    materials[index].halfSheet = editMaterialDescription.halfSheet,
    materials[index].fullSheet5 = editMaterialDescription.fullSheet5,
    materials[index].fullSheet21 = editMaterialDescription.fullSheet21,
    materials[index].isa = editMaterialDescription.isa,
    materials[index].matCollection = editMaterialDescription.matCollection;

    //commit changes to database
    $scope.saveMaterials(materials, materials[index], "update", index);
  };

  $scope.saveMaterials = function(materials, material, action, parameter){
  console.log(material, action, parameter)

  //Make the real match the temp.
    $scope.tempMaterials = materials;
  //declaring json data
    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
    $http.post('/savematerials', {"materials":materials, "material": material, "action": action, "parameter": parameter}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.addAlert("success", "Material " + action + "'d Successfully");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.addAlert("danger", "Error: Material did not " + action);
        console.log("Nope.jpg");
    });
  };

$scope.addNewProduct = function(products, tempProducts, productDescription){
    console.log(productDescription);
    var product = {
      distributor : productDescription.distributor,
      manufacturer : productDescription.manufacturer,
      type : productDescription.type,
      description : productDescription.description,
      itemCode : productDescription.itemCode,
      price : productDescription.price
    };
    products.push(product);
    $scope.tempProducts = products;
    console.log(products);
    console.log(product);

    $scope.saveProducts(products, product, "add");
  };

  $scope.deleteProduct = function(products, tempProducts, editProductDescription){
    console.log(editProductDescription);

    var index = arraySearch(editProductDescription._id, products)
    //delete item
    products.splice(index, 1);

    $scope.editProductDistributor = "";
    $scope.editProductManufacturer = "";
    $scope.editProductType = "";
    $scope.editProductDescription = "";
    $scope.editProductItemCode = "";
    $scope.editProductPrice = "";
    
    //commit changes to database
    $scope.saveProducts(products, "", "delete", editProductDescription._id);
  };

  $scope.updateProduct = function(products, tempProducts, editProductDescription){
    console.log(products);
    console.log(editProductDescription);

    var index = arraySearch(editProductDescription._id, tempProducts);
    console.log(index);

    products[index].itemCode = editProductDescription.itemCode,
    products[index].price = editProductDescription.price,
 
    //commit changes to database
    $scope.saveProducts(products, products[index], "update", index);
  };


	$scope.saveProducts = function(products, product, action, parameter){
    console.log(product, action, parameter);

  //Make the real match the temp.
    $scope.tempProducts = products;
  //declaring json data
    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
    $http.post('/saveproducts', {"products":products, "product": product, "action": action, "parameter": parameter}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.addAlert("success", "Material " + action + "'d Successfully");
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.addAlert("danger", "Error: Material did not " + action);
        console.log("Nope.jpg");
      });
  };
}]);