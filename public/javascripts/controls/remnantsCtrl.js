(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('remnantsCtrl', remnantsCtrl);

	remnantsCtrl.$inject = ['dataFactory', '$http'];

	function remnantsCtrl(dataFactory, $http) {
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

        vm.init = function(){
            vm.sortType = "remnantID";
        };     

        /*
            Start of the Remnants Edit Ctrl Section
        */

        //nameKey = string to find | myArray = the array | property = which property to find it in)
        vm.arraySearch = function (nameKey, myArray, property){
            //console.log(nameKey, myArray, property);
            for (var i=0; i < myArray.length; i++) {
                //console.log("my array i", myArray[i], "property", property)
                if (myArray[i][property] === nameKey) {
                    return i;
                };
            };
        };


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

        vm.editRemnant = function(remnantID) {
            var search = vm.arraySearch(remnantID, vm.remnants, "remnantID");
            console.log("Editing remnant ", vm.remnants[search]);
        	vm.remnants[search].edit = true;
        };

        vm.cancelEditRemnant = function(remnantID) {
            console.log("Closing edit on", remnantID)
        	//Hides edit input boxes
            var search = vm.arraySearch(remnantID, vm.remnants, "remnantID");
        	vm.remnants[search].edit = false;
        };

        vm.saveEditRemnant = function(edit, remnantID) {
        	console.log(reemnantID, edit);
            //search through vm.remnants for correct position (index changes when sorted)
            var search = vm.arraySearch(remnantID, vm.remnants, "remnantID");
        	vm.remnants[search].edit = false;
        	if(typeof edit !== "undefined") {
        		if(edit.length){vm.remnants[search].length = edit.length};
	        	if(edit.width){vm.remnants[search].width = edit.width};
	        	if(edit.location){vm.remnants[search].location = edit.location};
	        	vm.saveRemnant(vm.remnants[search], "update")	
        	};
        };

        vm.removeRemnant = function(remnantID) {
            var search = vm.arraySearch(remnantID, vm.remnants, "remnantID");
            console.log(search, vm.remnants[search]);
        	vm.saveRemnant(vm.remnants[search], "remove");
        	vm.remnants.splice(search, 1);
        };

        vm.saveRemnant = function(remnants, action){
        	console.log(action + " remnant");
        	console.log(remnants, action);

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
        /*
            End of the Remnants Edit Ctrl Section
        */
        /*
            Start of the Remnants View Ctrl Section
        */
        vm.links = [
            {"name":"Avonite","url":"http://www.avonite.com/colors/", "type":"Acrylic"},
            {"name":"Corian","url":"http://www.corian.com/-colors-of-corian-r-", "type":"Acrylic"},
            {"name":"Formica","url":"http://www.formica.com/en/ca/products/formica-solid-surfacing-home#swatchesTab", "type":"Acrylic"},
            {"name":"Hanex Solid Surface","url":"http://hanwhasurfaces.com/site/hanexcollection", "type":"Acrylic"},
            {"name":"LG Hi-Macs","url":"http://www.lghimacsusa.com/productOverviews/33/by-product-line", "type":"Acrylic"},
            {"name":"Meganite","url":"https://www.meganite.com/en_ww/colors/", "type":"Acrylic"},
            {"name":"Staron","url":"http://www.leezasurfaces.com/products.php?type=Staron", "type":"Acrylic"},
            {"name":"Wilsonart","url":"http://www.wilsonart.com/solid-surface/design-library", "type":"Acrylic"},
            {"name":"Casarstone","url":"http://www.caesarstone.ca/collections/", "type":"Quartz"},
            {"name":"Icestone","url":"https://icestoneusa.com/products/icestone/", "type":"Quartz"},
            {"name":"Kstone Quartz","url":"https://www.kstonecollections.com/gallery", "type":"Quartz"},
            {"name":"LG Viatera","url":"http://www.lgviaterausa.com/productOverviews/83/by-product-line", "type":"Quartz"},
            {"name":"Olympia Tile+Stone","url":"http://www.olympiatile-slabs.com", "type":"Quartz"},
            {"name":"Silestone","url":"https://ca.silestone.com/colours/", "type":"Quartz"},
            {"name":"TCE Stone","url":"http://tcestone.com/?page_id=299", "type":"Quartz"},
            {"name":"Zodiac","url":"http://www.zodiaq.com/-colors- of-zodiaq-r-", "type":"Quartz"},
            {"name":"Hanstone Quartz","url":"http://hanwhasurfaces.com/site/hanstonecollection", "type":"Quartz"}
        ];

        vm.printScreen = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><head> '
                + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">'
                + ' <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">'
                + ' <link rel="stylesheet" type="text/css" href="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.1/angular-material.css"/>'
                + ' </head> <body onload="window.print()"> <br><br>' + printContents + '</body> </html>');
            popupWin.document.close();
        }; 

        /*
            End of the Remnants View Ctrl Section
        */
	}; 
}());