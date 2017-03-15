(function() {
  'use strict';

  angular
    .module('surfacingSolutions')
    .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['dataFactory', '$stateParams', '$http', '$window', '$scope', '$mdDialog'];

    function adminCtrl(dataFactory, $stateParams, $http, $window, $scope, $mdDialog) {
    	
      var vm = this;

      dataFactory.getProductsMaterials()
        .then(function(data) {
          vm.products = data.products;
          vm.materials = data.materials;
          vm.uniqueMaterialsProducts();
        })
      dataFactory.getAccounts()
        .then(function(data) {
          vm.accounts = data.accounts;
        })
      
      vm.alerts = [];

      vm.updateDBModal = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Update ' + vm.dataBase + ' Database')
              .textContent('Are you sure you want to drop the ' + vm.dataBase + " database and replace it's contents with the text below?")
              //.placeholder('Enter an Email')
              .ariaLabel('Replace DB')
              //.initialValue(vm.customer.email)
          .targetEvent(ev)
              .ok('Replace DB')
              .cancel('Cancel');


        $mdDialog.show(confirm).then(function(result) {
          console.log("User chose to update DB");
          vm.updateDB();
        }, function() {
          console.log("User Cancelled.");
        });
      };

      vm.updateDB = function() {
        //console.log(action, parameter);
        //declaring json data
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $http.post('/updatedb', {"json": vm.jsonArray, "dataBase": vm.dataBase}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            vm.errors = "Database updated successfully"
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            //vm.addAlert("danger", "Error: Product did not " + action);
            console.log("Nope.jpg");
          });
          
          //Reload all data
          dataFactory.getProductsMaterials()
          .then(function(data) {
            vm.products = data.products;
            vm.materials = data.materials;
            vm.uniqueMaterialsProducts();
          });
      };

      function arraySearch(nameKey, myArray){
          for (var i=0; i < myArray.length; i++) {
              if (myArray[i]._id === nameKey) {
                  return i;
              };
          };
      };


      vm.uniqueSort = function(column, array){

        var result = {};
        var unique = {};
        var distinct = [];

        for( var i in array ){
          //console.log(array[i][column]);
          if( typeof(unique[array[i][column]]) == "undefined"){
            result = {
              [column] : array[i][column]
            };
            distinct.push(result);
          };
          unique[array[i][column]] = 0;
        };
        return distinct;
      };

      vm.uniqueMaterialsProducts = function(){

        vm.uniqueProductDistributor = vm.uniqueSort("distributor", vm.products);
        //console.log(vm.uniqueProductDistributor);
        vm.uniqueProductManufacturer = vm.uniqueSort("manufacturer", vm.products);
        //console.log(vm.uniqueProductManufacturer);
        vm.uniqueProductDescription = vm.uniqueSort("description", vm.products);
        //console.log(vm.uniqueProductManufacturer);
        vm.uniqueProductType = vm.uniqueSort("productType", vm.products);
        //console.log(vm.uniqueProductType);
        
        vm.uniqueMaterialDistributor = vm.uniqueSort("distributor", vm.materials);
        //console.log(vm.uniqueMaterialDistributor);
        vm.uniqueMaterialManufacturer = vm.uniqueSort("manufacturer", vm.materials);
        //console.log(vm.uniqueMaterialManufacturer);
        vm.uniqueMaterialDescription = vm.uniqueSort("description", vm.materials);
        //console.log(vm.uniqueMaterialDescription);
        vm.uniqueMaterialColourGroup = vm.uniqueSort("colourGroup", vm.materials);
        //console.log(vm.uniqueMaterialColourGroup);
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
        var material = {
          distributor : materialDescription.distributor,
          manufacturer : materialDescription.manufacturer,
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
        //console.log(vm.materials);
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

        //id won't be the same unless the page is refreshed.
        var query = {
          itemCode : editMaterialDescription.itemCode,
          thickness : editMaterialDescription.thickness,
          length : editMaterialDescription.length,
          width : editMaterialDescription.width,
          fullSheet1 : editMaterialDescription.fullSheet1,
          halfSheet : editMaterialDescription.halfSheet,
          fullSheet5 : editMaterialDescription.fullSheet5,
          fullSheet21 : editMaterialDescription.fullSheet21,
          isa : editMaterialDescription.isa,
          matCollection : editMaterialDescription.matCollection,
          formula : editMaterialDescription.formula
        };
        console.log(query);
        //commit changes to database
        vm.saveMaterials("delete", query);
      };

      vm.updateMaterial = function(editMaterialDescription){
        //console.log(vm.materials);
        //console.log(editMaterialDescription);

        var index = arraySearch(editMaterialDescription._id, vm.materials);
        //console.log(index);

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
      //console.log(action, parameter, vm.materials[parameter]);
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
          productType : productDescription.productType,
          description : productDescription.description,
          itemCode : productDescription.itemCode,
          price : productDescription.price,
          formula : productDescription.formula,
          mandatory : productDescription.mandatory,
          nonMandatory : productDescription.nonMandatory
        };
        vm.products.push(product);
        vm.saveProducts("add", product);
      };

      vm.deleteProduct = function(editProductDescription){
        //Need to add a warning box of deletion like in sending an email in quote send

        var index = arraySearch(editProductDescription._id, vm.products)
        //delete item
        vm.products.splice(index, 1);

        vm.newEditProduct = false;
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
        //console.log(editProductDescription);

        var index = arraySearch(editProductDescription._id, vm.products);
        console.log(index);

        vm.products[index].itemCode = editProductDescription.itemCode;
        vm.products[index].price = editProductDescription.price;
        vm.products[index].mandatory = editProductDescription.mandatory;
        vm.products[index].nonMandatory = editProductDescription.nonMandatory;

     
        //commit changes to database
        vm.saveProducts("update", index);
      };

      //I don't think I use this one either.
    	vm.saveProducts = function(action, parameter){
        //console.log(action, parameter);
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
          
          //Reload all data
          dataFactory.getProductsMaterials()
          .then(function(data) {
            vm.products = data.products;
            vm.materials = data.materials;
            vm.uniqueMaterialsProducts();
          });
      };

      //Integrating jQuery Mr. Data Converter code to my code.
      vm.importInputTextChange = function(){
        //Clear error logs
        vm.errors = "";
        CSVParser.resetLog();
        console.log(vm.dataBase)
        if (vm.dataBase =="") {
          vm.errors = "Please Select a DB";
        } else {

        };

        if (vm.importInputText.length > 0) {
          var parseOutput = CSVParser.parse(vm.importInputText, true, "tab", false, false);

          var dataGrid = parseOutput.dataGrid;
          var headerNames = parseOutput.headerNames;
          var headerTypes = parseOutput.headerTypes;

          parseOutput = DataGridRenderer['json'](dataGrid, headerNames, headerTypes, false, "\n");

          var jsonArray = {
            data : "",
            db : vm.dataBase
          };
          console.log(parseOutput);
          if(!parseOutput.errors){
            jsonArray.data = JSON.parse(parseOutput);
            //console.log(jsonArray.data, jsonArray.data.length);
            if(vm.dataBase == 'materials'){
              var columnToCheck = ["manufacturer", "distributor", "materialType", "colourGroup", "description", "matCollection", "itemCode", "thickness", "length", "width", "quarterSheet", "halfSheet", "fullSheet1", "fullSheet5", "fullSheet21", "isa", "sale"];
            } else if(vm.dataBase == 'products') {
              var columnToCheck = ["distributor", 'manufacturer', 'productType', 'description', 'itemCode', 'price', 'formula', 'mandatory', 'nonMandatory'];
            };
            if (jsonArray.data.length !== 0) {
              for (var i = columnToCheck.length - 1; i >= 0; i--) {
                if (typeof jsonArray.data[0][columnToCheck[i]] === "undefined"){
                  if (vm.errors == "") {
                    vm.errors += "The following Columns are missing: \n";
                  };
                  vm.errors += columnToCheck[i] + "\n"
                };
              };
            } else {
              vm.errors += "Excel data invalid, please clear text and try again.";
            };

            if(vm.errors !== "") {
              vm.errors = "There are errors: \n" + vm.errors;
            } else
            {
              vm.errors = "All Columns are accounted for!";

            };
            vm.jsonArray = jsonArray;
            console.log(jsonArray)
          };
        } else {
          vm.errors = parseOutput.errors;
        };
      };
  };
}());