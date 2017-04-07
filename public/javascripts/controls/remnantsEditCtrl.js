(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('remnantsEditCtrl', remnantsEditCtrl);

	remnantsEditCtrl.$inject = ['dataFactory', '$http'];

	function remnantsEditCtrl(dataFactory, $http) {
		var vm = this;
		dataFactory.getProductsMaterials()
        .then(function(data) {
          vm.products = data.products;
          vm.materials = data.materials;
        })
      	dataFactory.getRemnants()
        .then(function(data) {
          vm.remnants = data.remnants;
          vm.remnantsIndex = data.remnantsIndex;
          console.log(data)
        })

        vm.addRemnant = function(material) {
        	console.log(material)
            if(typeof vm.remnants == 'undefined'){
        		vm.remnants = [];
        	}
        	var remnant = {
        		manufacturer: material.manufacturer,
				remnantType: material.materialType,
				colourGroup: material.colourGroup,
				description: material.description,
				thickness: material.thickness,
				length: material.length,
				width: material.width,
				location: material.location,
                hold: false
        	};
        	console.log(vm.remnants)
        	vm.remnants.push(remnant);
        	console.log(vm.remnants)
        	vm.saveRemnant(remnant, "add");
        };

        vm.editRemnant = function(index) {
        	//console.log("Editing remnant ", vm.remnants[index])
        	vm.remnants[index].edit = true;
        };

        vm.cancelEditRemnant = function(index) {
        	//Hides edit input boxes
        	vm.remnants[index].edit = false;
        };

        vm.saveEditRemnant = function(index, edit) {
        	console.log(index, edit);
        	vm.remnants[index].edit = false;
        	if(typeof edit !== "undefined") {

        		if(edit.length){vm.remnants[index].length = edit.length};
	        	if(edit.width){vm.remnants[index].width = edit.width};
	        	if(edit.location){vm.remnants[index].location = edit.location};
	        	vm.saveRemnant(vm.remnants[index], "update")	
        	};
        };

        vm.removeRemnant = function(index) {
        	vm.saveRemnant(vm.remnants[index], "remove");
        	vm.remnants.splice(index, 1);
        };

        vm.saveRemnant = function(remnants, action){
        	console.log(action + " remnant");
        	console.log(remnants);

	        //declaring json data
	        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
	        $http.post('/updateremnants', {"data": remnants, "action": action}).
	          success(function(data, status, headers, config) {
	            // this callback will be called asynchronously
	            // when the response is available
	            // = "Database updated successfully"
	            console.log("Database updated successfully");
	            vm.loadRemnants();
	          }).
	          error(function(data, status, headers, config) {
	            // called asynchronously if an error occurs
	            // or server returns response with an error status.
	            //vm.addAlert("danger", "Error: Product did not " + action);
	            console.log("Nope.jpg");
	            vm.loadRemnants();
	          });
	         
    	};
    	vm.loadRemnants = function() {
    		//Reload all data
	        dataFactory.getRemnants()
	        	.then(function(data) {
	            vm.remnants = data.remnants;
	            console.log(vm.remnants)
	        });
    	};
	}; 
}());