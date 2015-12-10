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


      vm.addNewMaterial = function(materialDescription){
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
        vm.materials.push(material);
        console.log(vm.materials);
        console.log(material);

        vm.saveMaterials("add", material);
      };

      vm.deleteMaterial = function(editMaterialDescription){
        console.log(editMaterialDescription);

        var index = arraySearch(editMaterialDescription._id, vm.materials)
        //delete item
        vm.materials.splice(index, 1);

        vm.editMaterialDistributor = "";
        vm.editMaterialManufacturer = "";
        vm.editMaterialColourGroup = "";
        vm.editMaterialDescription = "";
        
        //commit changes to database
        vm.saveMaterials("delete", editMaterialDescription._id);
      };

      vm.updateMaterial = function(editMaterialDescription){
        //console.log(vm.materials);
        console.log(editMaterialDescription);

        var index = arraySearch(editMaterialDescription._id, vm.materials);
        console.log(index);

        vm.materials[index].itemCode = editMaterialDescription.itemCode,
        vm.materials[index].thickness = editMaterialDescription.thickness,
        vm.materials[index].length = editMaterialDescription.length,
        vm.materials[index].width = editMaterialDescription.width,
        vm.materials[index].fullSheet1 = editMaterialDescription.fullSheet1,
        vm.materials[index].halfSheet = editMaterialDescription.halfSheet,
        vm.materials[index].fullSheet5 = editMaterialDescription.fullSheet5,
        vm.materials[index].fullSheet21 = editMaterialDescription.fullSheet21,
        vm.materials[index].isa = editMaterialDescription.isa,
        vm.materials[index].matCollection = editMaterialDescription.matCollection,
        vm.materials[index].formula = editMaterialDescription.formula;

        //commit changes to database
        vm.saveMaterials("update", index);
      };

      vm.saveMaterials = function(action, parameter){
      console.log(action, parameter, vm.materials[parameter]);
      //declaring json data
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $http.post('/savematerials', {"material":vm.materials[parameter], "action": action, "parameter": parameter}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            if(action == 'add'){
              vm.addAlert("success", "Material " + action + "ed Successfully");
            } else {
              vm.addAlert("success", "Material " + action + "d Successfully");
            };
          })
          .error(function(data, status, headers, config) {
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
          price : productDescription.price,
          formula : productDescription.formula
        };
        vm.products.push(product);
        console.log(vm.products);
        console.log(vm.product);

        vm.saveProducts("add", product);
      };

      vm.deleteProduct = function(editProductDescription){
        console.log(editProductDescription);

        var index = arraySearch(editProductDescription._id, vm.products)
        //delete item
        vm.products.splice(index, 1);

        vm.editProductDistributor = "";
        vm.editProductManufacturer = "";
        vm.editProductType = "";
        vm.editProductDescription = "";
        vm.editProductItemCode = "";
        vm.editProductPrice = "";
        
        //commit changes to database
        vm.saveProducts("delete", editProductDescription._id);
      };

      vm.updateProduct = function(editProductDescription){
        //console.log(vm.products);
        console.log(editProductDescription);

        var index = arraySearch(editProductDescription._id, vm.products);
        console.log(index);

        vm.products[index].itemCode = editProductDescription.itemCode,
        vm.products[index].price = editProductDescription.price,
     
        //commit changes to database
        vm.saveProducts("update", index);
      };

      //I don't think I use this one either.
    	vm.saveProducts = function(action, parameter){
        console.log(action, parameter);

      //declaring json data
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $http.post('/saveproducts', {"product": vm.products[parameter], "action": action, "parameter": parameter}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            if(action == 'add'){
              vm.addAlert("success", "Product " + action + "ed Successfully");
            } else {
              vm.addAlert("success", "Product " + action + "d Successfully");
            };
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            vm.addAlert("danger", "Error: Product did not " + action);
            console.log("Nope.jpg");
          });
      };
  };
}());