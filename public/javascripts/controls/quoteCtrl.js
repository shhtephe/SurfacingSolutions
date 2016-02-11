(function() {
	'use strict';
 
	angular.module('surfacingSolutions')
	.controller('quoteCtrl', quoteCtrl);

	quoteCtrl.$inject = ['dataFactory', '$stateParams', '$http', '$scope', '$uibModal'];

	function quoteCtrl(dataFactory, $stateParams, $http, $scope, $uibModal) {
		//'this' replaces $scope
		var vm = this;
		vm.Math = Math.PI;
		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;


		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.terms = data.terms;
				vm.customer = data.customer;
				vm.products = data.products;
				vm.materials = data.materials;
				vm.terms = data.terms;
			},
			function(reason) {
				console.log(reason);
			});		

		//baby's first modal
		vm.addCounter = function (groupIndex, material, counters, size) {
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'addcounter.html',
		      controller: ['$uibModalInstance', 'materials', 'products', 'material', 'counters', 'groupIndex', addTableCtrl],
		      controllerAs: 'vm',
		      size: size,
		      resolve: {
		        materials: function() {return vm.materials},
		        products: function() {return vm.products},
		        groupIndex: function() {return groupIndex},
		        material: function() {return material},
		        counters: function() {return counters}
		        }
      	  	});

      	  	modalInstance.result.then(function (counter) {
				console.log(counter.width, counter.length, counter.shape, counter.material, counter.counters, counter.groupIndex, counter.description, true);
      			//Save the countertop and put all the data back onto the main controller
      			vm.calculateCounter(counter.width, counter.length, counter.shape, counter.material, counter.counters, counter.groupIndex, counter.description, true);
      			//do the same thing with each addon
      			//console.log(counter.addons, counter.counters)
      			for (var i=0; i < counter.addons.length; i++) {
      				//console.log("i", i, counter.addons[i]);
			    	vm.saveAddon(counter.addons[i], counter.counters, counter.groupIndex)
			    };  				
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var addTableCtrl = function($uibModalInstance, materials, products, material, counters, groupIndex) {
	    	var vm = this;
	    	vm.materials = materials;
	    	vm.material = material;
	    	vm.groupIndex = groupIndex;
	    	vm.products = products;
	    	vm.counters = counters;
	    	vm.addons = [];

			vm.arraySearchModal = function (nameKey, myArray, property){
			    //console.log(nameKey, myArray, property);
			    for (var i=0; i < myArray.length; i++) {
			    	//console.log("my array i", myArray[i], "property", property)
			        if (myArray[i][property] === nameKey) {
			            return i;
			        };
			    };
			};

	    	vm.saveCounterModal = function(width, length, shape, description, addons, material, counters) {
	    		//console.log(counters);
	    		var counter = {
	    			width: width,
	    			length: length, 
	    			shape: shape, 
	    			groupIndex: groupIndex,
	    			description: description,
	    			addons: addons,
	    			material: material,
	    			counters: counters
	    		};

	    		$uibModalInstance.close(counter);
	    	};

			vm.saveAddonModal = function(addon, shape, length, width) {
				if(typeof vm.addons === undefined){
					var addons = [];
				}else{
					var addons = vm.addons;
				};
				var pushObj = {};
				var search = vm.arraySearchModal(addon.description, addons, "description");

				//console.log(addon);


				var totalPrice = 0;
				var counterLength = length;
				var counterWidth = width;
				var squareFootage = 0;

				//console.log(addon.formula, addon.quantity, addon.price);

				if (addon.formula === "item") {
					totalPrice =  addon.quantity * addon.price;
				}else if(addon.formula === "square"){
					console.log(vm.quote.counters[index]);
					if(shape === "rectangle"){
						squareFootage = counterLength * counterWidth;
						addon.quantity = squareFootage;
						totalPrice = addon.price * squareFootage;
						console.log(counterLength, counterWidth, squareFootage, totalPrice, addon.price);
					} else if(shape === "circle"){
						squareFootage = (Math.PI * (Math.pow(counterWidth, 2)));
						squareFootage = squareFootage.toFixed(2);
						addon.quantity = squareFootage;
						totalPrice = addon.price * squareFootage;
					};
				}else if(addon.formula === "linear"){	
						addon.quantity = squareFootage;
						totalPrice = addon.linear * price;
				}else{
					console.log("This shouldn't ever run, I think!");
					totalPrice = addon.quantity * addon.price;
				};

				//Searches for the item by going through the list
				if (typeof search === "undefined") {
					//Couldn't find it, so add a new value
					pushObj = {
						distributor: addon.distributor,
						manufacturer: addon.manufacturer,
						type: addon.type,
						description: addon.description,
						itemCode: addon.itemCode,
						price: addon.price,
						formula: addon.formula,
						quantity: addon.quantity,
						totalPrice: totalPrice,
					};
					addons.push(pushObj);
					//console.log("Addons:", addons);
					//console.log("pushObj", pushObj);
					totalPrice += vm.addons[addons.length-1].totalPrice;
				} else {
					//Found it, so update the value
					addons[search].quantity = addon.quantity;
					addons[search].totalPrice = totalPrice;
					//below code will be done when modal is saved and we're back on the normal page
					//vm.quote.counters[index].totalPrice += addons[search].totalPrice;
				};
				vm.addons = addons;
			};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    };

		//assign checkboxes for Terms of Service
		vm.checkTerms = function (term){
			var terms = vm.quote.terms;
			if (typeof vm.arraySearch(term.term, terms, "term") !== "undefined") {
				//Found the term, so check the box
				return true;
			} else {
				return false;
			};
		};
		

		vm.arraySearch = function (nameKey, myArray, property){
		    //console.log(nameKey, myArray, property);
		    for (var i=0; i < myArray.length; i++) {
		    	//console.log("my array i", myArray[i], "property", property)
		        if (myArray[i][property] === nameKey) {
		            return i;
		        };
		    };
		};

		vm.buildTerms = function(term){
			var terms = vm.quote.terms;
			var pushObj = {};
			//console.log("Term", term, "Terms", terms);
			//If there are no terms, add empty terms to quote
			if (typeof terms === "undefined") {
				terms = [];
			};
			//console.log("Search", vm.arraySearch(term.terms, terms, "term"));
			if (typeof vm.arraySearch(term.term, terms, "term") !== "undefined") {
				//make sure it matches
				//console.log("Found Entry");
				//Found it, so remove it from the terms
				terms.splice(vm.arraySearch(term.term, terms, "term"), 1);
			} else {
				//console.log("Couldn't find entry");
				//Couldn't find it, so add it to the terms
				pushObj = {
					term: term.term
				};
				terms.push(pushObj);
			};
			vm.quote.terms = terms;
		};

		vm.hideAddons = function(index) {  
			console.log(vm.counterAddonDistributor);
			vm.counterAddonDistributor = "",
			vm.counterAddonManufacturer = "",
			vm.counterAddonType = "",
			vm.counterAddonDescription = ""
		};

		vm.showCounter = function() {  
			vm.addCounter = true;
		};

		vm.showMandatory = function() {  
			vm.divMandatory = true;
		};

		vm.hideCounter = function() {  
			vm.addCounter = false;
			vm.shape = "",
			vm.counterWidth = "",
			vm.counterLength = "",
			vm.materialColourGroup = "",
			vm.materialDistributor = "", 
			vm.materialManufacturer = "",
			vm.materialColourGroup = "";
		};

		vm.alerts = [];

	  	vm.addAlert = function(type, msg) {
		    vm.alerts.push({
		    	type: type,
		    	msg: msg
		    });
	  	};

	  	vm.closeAlert = function(index) {
		    vm.alerts.splice(index, 1);
	  	};

	  	vm.changePricing = function(pricing, index, groupIndex, material) {
		console.log(pricing, index, material);
		var sheets = vm.quote.counterGroup[groupIndex].counters[index].sheets;
		var counterPrice = 0;

	  		if(pricing == "halfSheet"){
				counterPrice = sheets * material.halfSheet;		
				vm.quote.counterGroup[groupIndex].counters[index].pricing = "halfSheet";
			} else if(pricing =="fullSheet1"){
				counterPrice = sheets * material.fullSheet1;
				vm.quote.counterGroup[groupIndex].counters[index].pricing = "fullSheet1";
			} else if(pricing == "fullSheet5"){
				counterPrice = sheets * material.fullSheet5;
				vm.quote.counterGroup[groupIndex].counters[index].pricing = "fullSheet5";
			} else if(pricing == "fullSheet21") {
				counterPrice = sheets * material.fullSheet21;
				vm.quote.counterGroup[groupIndex].counters[index].pricing = "fullSheet21";
			} else if(pricing == "isa") {
				counterPrice = sheets * material.isa;
				vm.quote.counterGroup[groupIndex].counters[index].pricing = "isa";
			};
			//change price from old to new, and update main total
			vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			vm.quote.counterGroup[groupIndex].counters[index].totalPrice = counterPrice;
			vm.quote.totalPrice += vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
	  	};

	  	vm.saveMandatoryAddon = function(addon, index) {
	  		var addons = vm.quote.mandatoryAddons;
			var pushObj = {};
			var search = vm.arraySearch(addon.description, addons, "description");
			var oldPrice = 0;
			console.log(addon);

			var totalPrice = 0;

			console.log(addon.formula, addon.quantity, addon.price);
			totalPrice =  addon.quantity * addon.price;

			if (typeof search !== "undefined") {
				//Found the term, so overwrite the value
				console.log("Found it", vm.arraySearch(addon, addons, "description"));
				//store old addon price
				oldPrice = addons[search].totalPrice;
				//remove it from quote total
				console.log("oldprice", oldPrice, vm.quote.totalPrice);
				vm.quote.totalPrice -= oldPrice;
				console.log("Set price", vm.quote.totalPrice)
				//set new values
				addons[search].quantity = addon.quantity;
				addons[search].totalPrice = totalPrice;
				//update new quote price
				vm.quote.totalPrice += addons[search].totalPrice;
			} else {
				console.log("Didn't found it", vm.arraySearch(addon, addons, "description"));
				pushObj = {
					distributor: addon.distributor,
					manufacturer: addon.manufacturer,
					productType: addon.type,
					description: addon.description,
					itemCode: addon.itemCode,
					price: addon.price,
					formula: addon.formula,
					quantity: addon.quantity,
					totalPrice: totalPrice,
				};
				addons.push(pushObj);
				//console.log("Addons:", addons);
				//console.log("pushObj", pushObj);
				vm.quote.totalPrice += addons[addons.length-1].totalPrice;
			};

		};

		vm.saveAddon = function(addon, index, groupIndex) {
			console.log(addon);
			var addons = vm.quote.counterGroup[groupIndex].counters[index].addons;
			var pushObj = {};
			var shape = vm.quote.counterGroup[groupIndex].counters[index].counterShape;
			console.log(addon, addons);
			var search = vm.arraySearch(addon.description, addons, "description");
			console.log(search);

			var totalPrice = 0;
			var counterLength = vm.quote.counterGroup[groupIndex].counters[index].counterLength;
			var counterWidth = vm.quote.counterGroup[groupIndex].counters[index].counterWidth;
			var squareFootage = 0;

			console.log(addon.formula, addon.quantity, addon.price);
			if (addon.formula === "item") {
				totalPrice =  addon.quantity * addon.price;
			}else if(addon.formula === "square"){
				console.log(vm.quote.counters[index]);
				if(shape === "rectangle"){
					squareFootage = counterLength * counterWidth;
					addon.quantity = squareFootage;
					totalPrice = addon.price * squareFootage;
					console.log(counterLength, counterWidth, squareFootage, totalPrice, addon.price);
				} else if(shape === "circle"){
					squareFootage = (Math.PI * (Math.pow(counterWidth, 2)));
					squareFootage = squareFootage.toFixed(2);
					addon.quantity = squareFootage;
					totalPrice = addon.price * squareFootage;
				};
			}else if(addon.formula === "linear"){	
					addon.quantity = squareFootage;
					totalPrice = addon.linear * price;
			}else{
				console.log("This shouldn't ever run, I think!");
				totalPrice = addon.quantity * addon.price;
			};

			//Searches for the item by going through the list
			if (typeof search === "undefined") {
				//Couldn't find it, so add a new value
				pushObj = {
					distributor: addon.distributor,
					manufacturer: addon.manufacturer,
					productType: addon.type,
					description: addon.description,
					itemCode: addon.itemCode,
					price: addon.price,
					formula: addon.formula,
					quantity: addon.quantity,
					totalPrice: totalPrice,
				};
				addons.push(pushObj);
				//console.log("Addons:", addons);
				//console.log("pushObj", pushObj);
				vm.quote.counterGroup[groupIndex].counters[index].totalPrice += addons[addons.length-1].totalPrice;
			} else {
				//Found it, so update the value
				addons[search].quantity = addon.quantity;
				addons[search].totalPrice = totalPrice;
				vm.quote.counterGroup[groupIndex].counters[index].totalPrice += addons[search].totalPrice;
			};

			vm.dropDown1 = "";
			vm.dropDown2 = "";
			vm.addonQuantity = "";
			console.log(vm.quote.totalPrice, totalPrice);
			vm.quote.totalPrice += totalPrice;
			vm.quote.counterGroup[groupIndex].totalPrice += totalPrice;
			//vm.hideAddons();
		};	
		
		vm.removeAddon = function(addon, counterIndex, addonIndex){		
			vm.quote.totalPrice -= addon.totalPrice;
			if(counterIndex === -1){
				//if mandatory:
				vm.quote.mandatoryAddons.splice(addonIndex, 1);
			} else {
				//If normal: 
				vm.quote.counters[counterIndex].totalPrice -= addon.totalPrice;
				vm.quote.counters[counterIndex].addons.splice(addonIndex, 1);
			};
		};

		vm.addGroup = function() {
			var pushObj = {};

			//check to see if first group
			if(typeof vm.quote.counterGroup[0] === "undefined") {
				pushObj = 
				{
					groupNumber : 0,
					counters: [],
					totalPrice: 0
				};
			} else {
				pushObj = {
					groupNumber : vm.quote.counterGroup.length,
					counters: [],
					totalPrice: 0
				};
			};
			vm.quote.counterGroup.push(pushObj);
		};

		vm.removeGroup = function(index) {
			console.log(index, vm.quote.counterGroup[index].totalPrice);
			vm.quote.totalPrice -= vm.quote.counterGroup[index].totalPrice;
			vm.quote.counterGroup.splice(index, index+1);

		};


		vm.saveMaterial = function(material, index){
			console.log(material);
			vm.quote.counterGroup[index].material = {
				itemCode: material.itemCode,
				thickness: material.thickness,
				width: material.width,
				length: material.length,
				price: material.price,
				halfSheet: material.halfSheet,
				fullSheet1: material.fullSheet1,
				fullSheet5: material.fullSheet5,
				fullSheet20: material.fullSheet20,
				isa: material.isa,
				distributor: material.distributor,
				manufacturer: material.manufacturer,
				colourGroup: material.colourGroup,
				description: material.description
			};
			console.log(vm.quote.counterGroup[index].material);
		};

		vm.saveCounter = function(width, length, shape, index, groupIndex, description, modal){
			console.log(width, length, shape, index, groupIndex, description);

			//Makes doing math later down easier.
			if(shape === "circle"){
				length = width;
			};
			//Create an object containing all core counter information, also leaving addons space
			pushObj = {
				description: description,
				counterShape: shape,
				counterLength: length,
				counterWidth: width,
				totalPrice: 0,
				addons: [],
				mandatoryCharges: []
			};
		};

		vm.calculateCounter = function(width, length, shape, material, index, groupIndex, description, modal) {
		console.log("Width", width, "Length", length, "Shape", shape, "Material", material, "Index", index, "Group Index", groupIndex, "description", description);

		//Obviously, we set some variables. 
			var squareFootage = 0;
			var sheets = 0;
			var lastPrice = 0;
			var counterPrice = 0;
			var totalPrice = 0;
			var pushObj = {};
			var pushMandatory = {};
			var pushMandatoryDropDown = {};
			var pricing = "";
			var counterIndex = vm.quote.counterGroup[groupIndex].counters.length;
			console.log(counterIndex, index);

			//Makes doing math later down easier.
			if(shape === "circle"){
				length = width;
			};

			//console.log(width + "/" + length + "/" + shape + "/" + material.colourGroup + "/" + material.description + "/" + material.fullSheet1)
			//console.log("width: " + width + "/length: " + length);

		//Create an object containing all core counter information, also leaving addons space
			pushObj = {
				description: description,
				counterShape: shape,
				counterLength: length,
				counterWidth: width,
				price: 0,
				addons: [],
				mandatoryCharges: []
			};

			//console.log("Push Object", pushObj);

	//Checks the shape of the table, and then calculates square footage.
			if(shape === "rectangle"){
				squareFootage = (length * width/144); //measurements are in inches, then converted to feet
			} else if(shape === "circle"){
				squareFootage = (Math.PI * (Math.pow(width, 2)));
			};
			squareFootage = squareFootage.toFixed(2);
			console.log(squareFootage, length, width);

	//Calculate how many sheets are needed. Will need to revamp this: check width and length of sheets as well as square footage
			sheets = squareFootage / (material.length * material.width/144);
			console.log("Sheets: " + sheets);
			sheets = sheets.toFixed(1);
			console.log("Sheets: " + sheets);
			console.log(material.length, material.width);
	//Chooses the best match for pricing. Will need to make this user selectable later.
			if(sheets <=.5 && material.halfSheet){
			console.log("This ran 1", sheets, material.halfSheet, squareFootage, length, width, material.width, material.length);
				//it will round down to 0, so make it one sheet
				sheets = 1;
				counterPrice = sheets * material.halfSheet;		
				pricing = "halfSheet";
			} else if(sheets <5 && material.fullSheet1){
			console.log("This ran 2");
				counterPrice = sheets * material.fullSheet1;
				pricing = "fullSheet1";
			} else if(sheets <21 && material.fullSheet5){
			console.log("This ran 3");
				counterPrice = sheets * material.fullSheet5;
				pricing = "fullSheet5";
			} else if(sheets >=21 && material.fullSheet21) {
			console.log("This ran 4");
				counterPrice = sheets * material.fullSheet21;
				pricing = "fullSheet21";
			} else {
			console.log("Loop 5 | Sheets: " + sheets + " | Price: " + material.fullSheet1);
				counterPrice = sheets * material.fullSheet1;
			};
			console.log(counterPrice, sheets, typeof modal);
	//Commits data to arrays depending on whether it's an edit or a new save.
			if(modal === true){
				vm.quote.counterGroup[groupIndex].counters.push(pushObj);	
	//Set price of counter minues addons
				vm.quote.counterGroup[groupIndex].counters[counterIndex].totalPrice = counterPrice;
	//Add Pricing default and commit number of 'sheets' required for Counter
				vm.quote.counterGroup[groupIndex].counters[counterIndex].pricing = pricing;
				vm.quote.counterGroup[groupIndex].counters[counterIndex].sheets = sheets;
	//Save the price of the counter, and the total price of the vm.quote. Save it to the vm.quote variable.
				//WHAT THE FUCK DOES THIS LINE DO?
				//vm.quote.counterGroup[groupIndex].counters[counterIndex].material.price = vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].totalPrice;		
				vm.quote.totalPrice += vm.quote.counterGroup[groupIndex].counters[counterIndex].totalPrice;
				vm.quote.counterGroup[groupIndex].totalPrice += vm.quote.counterGroup[groupIndex].counters[counterIndex].totalPrice;
			} else{
	//Replace the existing addons into the new array :)
				if(typeof vm.quote.counterGroup[groupIndex].counters[index].addons.length !== undefined) {
					for (var i = vm.quote.counterGroup[groupIndex].counters[index].addons.length - 1; i >= 0; i--) {
						pushObj.addons.push(vm.quote.counterGroup[groupIndex].counters[index].addons[i]);6
					pushObj.totalPrice += vm.quote.counterGroup[groupIndex].counters[index].addons[i].totalPrice;
					};
				};
	//Replace counter total.
				pushObj.material.price = counterPrice;
				pushObj.totalPrice += counterPrice;
	//Add Pricing default and commit number of 'sheets' required for Counter
				pushObj.pricing = pricing;
				pushObj.sheets = sheets;
	//Add vm.quote total with new counter price but first replace old price.		
				vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
				vm.quote.totalPrice += pushObj.totalPrice;
				vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
				vm.quote.counterGroup[groupIndex].totalPrice += pushObj.totalPrice;
	//replace the counter object with the edited one.
				vm.quote.counterGroup[groupIndex].counters.splice(index, 1, pushObj);

				console.log(vm.quote.counterGroup[groupIndex].counter);
			};

			//vm.quote = vm.quote; - I don't think this is needed anymore, since VM is the view model and is already bound.

			//console.log("Counter Price w/o addons", vm.quote.counters[vm.quote.counters.length-1].material.price);
		};

		vm.deleteCounter = function(groupIndex, index) {
			vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			vm.quote.totalPrice-= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			//console.log(vm.quote.counters[index].totalPrice);
			vm.quote.counterGroup[groupIndex].counters.splice(index, index+1);
			//I don't think I need a refresh		$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
		};

		vm.saveQuote = function(description) {
			//console.log(vm.quote.jobDifficulty.$dirty);
			/*if(vm.quote.jobDifficulty.$dirty === true){
				console.log("value has changed");
			};*/

			//save the quote
			//Need to declare that it's sending a json doc
			$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
			$http.post('/savequote', {"quote":vm.quote}).
	  		success(function(data, status, headers, config) {
		    	// this callback will be called asynchronously
		    	// when the response is available
		    	vm.addAlert("success", "Quote saved Successfully");
		  	}).
	  		error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				vm.addAlert("danger", "Error: Quote did not save");
	  		});
		};
	};
	angular.module('surfacingSolutions')
	.filter('termDate', function() {
    return function(term, quote) {
      var date = " " + quote.createdAt.substring(0, 10);
      if(term == "This quotation is based on the measurements and specifications provided on "){
      		term += date;
		}
      return term;
    }
  });
}());