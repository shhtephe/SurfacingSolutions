(function() {
  'use strict';

  angular
    .module('surfacingSolutions')
    .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['dataFactory', '$stateParams', '$http'];

    function adminCtrl(dataFactory, $stateParams, $http) {
    	
      var vm = this;

      dataFactory.getProductsMaterials()
        .then(function(data) {
          console.log(data);
          vm.products = data.products;
          vm.materials = data.materials;
        })

      var 
        products = vm.products,
        materials = vm.materials;
      
      vm.alerts = [];

      function arraySearch(nameKey, myArray){
          for (var i=0; i < myArray.length; i++) {
              if (myArray[i]._id === nameKey) {
                  return i;
              };
          };
      };

      vm.addAlert = function(type, msg) {
        vm.alerts.push({
          type: type,
          msg: msg
        });
      };

      vm.closeAlert = function(index) {
        vm.alerts.splice(index, 1);
      };

      vm.hideNewMaterial = function(){
        vm.newMaterial = false;
      }

      vm.hideNewProduct = function(){
        vm.newProduct = false;
      }

      vm.showEditMaterial = function(){
        vm.newEditMaterial = true;
        vm.editMaterialDistributor = "";
        vm.editMaterialManufacturer = "";
        vm.editMaterialColourGroup = "";
        vm.editMaterialDescription = "";
      }

    	vm.showNewMaterial = function(){
    		vm.newMaterial = true;
        vm.newManufacturer="",
        vm.newDistributor="",
        vm.materialDescription="",
        vm.newItemCode="",
        vm.newColourGroup="",
        vm.newThickness="",
        vm.newLength="",
        vm.newWidth="",
        vm.newFullSheet1="",
        vm.newHalfSheet="",
        vm.newFullSheet5="",
        vm.newFullSheet21="";
        vm.newisa="",
        vm.newCollection="";
    	}

      vm.cancelSaveMaterial = function(){
        vm.newEditMaterial = false;
        vm.editMaterialDistributor = "";
        vm.editMaterialManufacturer = "";
        vm.editMaterialColourGroup = "";
        vm.editMaterialDescription = "";
        vm.tempMaterials = vm.materials;
      }

      vm.showEditProduct = function(){
        vm.newEditProduct = true;
        vm.editProductDistributor = "";
        vm.editProductManufacturer = "";
        vm.editProductType = "";
        vm.editProductdescription = "";
      }

      vm.showNewProduct = function(){
        vm.newProduct = true;
        vm.newManufacturer="",
        vm.newDistributor="",
        vm.materialDescription="",
        vm.newItemCode="",
        vm.newColourGroup="",
        vm.newThickness="",
        vm.newLength="",
        vm.newWidth="",
        vm.newFullSheet1="",
        vm.newHalfSheet="",
        vm.newFullSheet5="",
        vm.newFullSheet21="";
        vm.newisa="",
        vm.newCollection="";
      }

      vm.cancelSaveProduct = function(){
        vm.newEditProduct = false;
        vm.editProductDistributor = "";
        vm.editProductManufacturer = "";
        vm.editProductType = "";
        vm.editProductDescription = "";
        vm.tempProducts = vm.products;
      }


      vm.addNewMaterial = function(materials, tempMaterials, materialDescription){
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
        vm.tempMaterials = materials;
        console.log(materials);
        console.log(material);

        vm.saveMaterials(materials, material, "add");
      };

      vm.deleteMaterial = function(materials, tempMaterials, editMaterialDescription){
        console.log(editMaterialDescription);

        var index = arraySearch(editMaterialDescription._id, materials)
        //delete item
        materials.splice(index, 1);

        vm.editMaterialDistributor = "";
        vm.editMaterialManufacturer = "";
        vm.editMaterialColourGroup = "";
        vm.editMaterialDescription = "";
        
        //commit changes to database
        vm.saveMaterials(materials, "", "delete", editMaterialDescription._id);
      };

      vm.updateMaterial = function(editMaterialDescription){
        console.log(materials);
        console.log(editMaterialDescription);

        var index = arraySearch(editMaterialDescription._id, materials);
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
        materials[index].matCollection = editMaterialDescription.matCollection,
        materials[index].formula = editMaterialDescription.formula;

        //commit changes to database
        vm.saveMaterials(materials[index], "update", index);
      };

      vm.saveMaterials = function(material, action, parameter){
      console.log(material, action, parameter)

      //declaring json data
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $http.post('/savematerials', {"materials":materials, "material": material, "action": action, "parameter": parameter}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            vm.addAlert("success", "Material " + action + "'d Successfully");
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            vm.addAlert("danger", "Error: Material did not " + action);
            console.log("Nope.jpg");
        });
      };

    vm.addNewProduct = function(productDescription){
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
        vm.tempProducts = products;
        console.log(products);
        console.log(product);

        vm.saveProducts( product, "add");
      };

      vm.deleteProduct = function(editProductDescription){
        console.log(editProductDescription);

        var index = arraySearch(editProductDescription._id, products)
        //delete item
        products.splice(index, 1);

        vm.editProductDistributor = "";
        vm.editProductManufacturer = "";
        vm.editProductType = "";
        vm.editProductDescription = "";
        vm.editProductItemCode = "";
        vm.editProductPrice = "";
        
        //commit changes to database
        vm.saveProducts(products, "", "delete", editProductDescription._id);
      };

      vm.updateProduct = function(editProductDescription){
        console.log(products);
        console.log(editProductDescription);

        var index = arraySearch(editProductDescription._id, tempProducts);
        console.log(index);

        products[index].itemCode = editProductDescription.itemCode,
        products[index].price = editProductDescription.price,
     
        //commit changes to database
        vm.saveProducts(products, products[index], "update", index);
      };

      //I don't think I use this one either.
    	vm.saveProducts = function(product, action, parameter){
        console.log(product, action, parameter);

      //Make the real match the temp.
        vm.tempProducts = products;
      //declaring json data
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $http.post('/saveproducts', {"products":products, "product": product, "action": action, "parameter": parameter}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            vm.addAlert("success", "Material " + action + "'d Successfully");
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            vm.addAlert("danger", "Error: Material did not " + action);
            console.log("Nope.jpg");
          });
      };
  };
}());