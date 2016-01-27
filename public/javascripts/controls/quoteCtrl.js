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
		vm.addCounter = function (groupIndex, size) {
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'addtable.html',
		      controller: ['$uibModalInstance', 'materials', 'groupIndex', addTableCtrl],
		      controllerAs: 'vm',
		      size: size,
		      resolve: {
		        materials: function() {return vm.materials},
		        groupIndex: function() {return groupIndex}
		        }
      	  	});

      	  	modalInstance.result.then(function (counter, groupIndex) {
				//console.log(counter.width, counter.length, counter.shape, counter.material, counter.index);
      			vm.saveCounter(counter.width, counter.length, counter.shape, counter.material, counter.index, counter.groupIndex);
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var addTableCtrl = function($uibModalInstance, materials, groupIndex) {
	    	var vm = this;
	    	vm.materials = materials;
	    	vm.groupIndex = groupIndex;
	    	vm.saveCounterModal = function(width, length, shape, material, index) {
	    		var counter = {
	    			width: width,
	    			length: length, 
	    			shape: shape, 
	    			material: material,
	    			index: index,
	    			groupIndex: groupIndex
	    		};
	    		$uibModalInstance.close(counter);
	    	};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    }

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

	  	vm.changePricing = function(pricing, index) {
		console.log(pricing, index);
		var sheets = vm.quote.counters[index].sheets;
		var material = vm.quote.counters[index].material;
		var counterPrice = 0;

	  		if(pricing == "halfSheet"){
				counterPrice = sheets * material.halfSheet;		
				vm.quote.counters[index].pricing = "halfSheet";
			} else if(pricing =="fullsheet1"){
				counterPrice = sheets * material.fullSheet1;
				vm.quote.counters[index].pricing = "fullsheet1";
			} else if(pricing == "fullSheet5"){
				counterPrice = sheets * material.fullSheet5;
				vm.quote.counters[index].pricing = "fullSheet5";
			} else if(pricing == "fullSheet21") {
				counterPrice = sheets * material.fullSheet21;
				vm.quote.counters[index].pricing = "fullSheet21";
			} else if(pricing == "isa") {
				counterPrice = sheets * material.isa;
				vm.quote.counters[index].pricing = "isa";
			};
			//change price from old to new, and update main total
			vm.quote.totalPrice -= vm.quote.counters[index].totalPrice;
			vm.quote.counters[index].totalPrice = counterPrice;
			vm.quote.totalPrice += vm.quote.counters[index].totalPrice;
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

		vm.saveAddon = function(addon, index) {
			var addons = vm.quote.counters[index].addons;
			var pushObj = {};
			var shape = vm.quote.counters[index].counterShape;
			console.log(addon);
			var search = vm.arraySearch(addon.description, addons, "description");

			var totalPrice = 0;
			var counterLength = vm.quote.counters[index].counterLength;
			var counterWidth = vm.quote.counters[index].counterWidth;
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
				vm.quote.counters[index].totalPrice += addons[addons.length-1].totalPrice;
			} else {
				//Found it, so update the value
				addons[search].quantity = addon.quantity;
				addons[search].totalPrice = totalPrice;
				vm.quote.counters[index].totalPrice += addons[search].totalPrice;
			};

			vm.dropDown1 = "";
			vm.dropDown2 = "";
			vm.addonQuantity = "";
			console.log(vm.quote.totalPrice, totalPrice);
			vm.quote.totalPrice += totalPrice;
			//updatePrice(quantity, price, "addon"); - For use later
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
					groupNumber : vm.quote.counterGroup.length + 1
				};
			};
			vm.quote.counterGroup.push(pushObj);
		};

		vm.removeGroup = function(index) {
			vm.quote.counterGroup.splice(index, index+1);
		};

		vm.saveCounter = function(width, length, shape, material, index, groupIndex) {
		console.log("Width", width, "Length", length, "Shape", shape, "Material", material, "Index", index, "Group Index", groupIndex);

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
			//convert to feet
			length = length;
			width = width;

			//Makes doing math later down easier.
			if(shape === "circle"){
				length = width;
			};

			//console.log(width + "/" + length + "/" + shape + "/" + material.colourGroup + "/" + material.description + "/" + material.fullSheet1)
			//console.log("width: " + width + "/length: " + length);

		//Create an object containing all core counter information, also leaving addons space
			pushObj = {
				description: "",
				counterShape: shape,
				counterLength: length,
				counterWidth: width,
				totalPrice: 0,
				material:{
					itemCode: material.itemCode,
					thickness: material.thickness,
					width: material.width,
					length: material.length,
					price: 0,
					fullSheet1: material.fullSheet1,
					halfSheet: material.halfSheet,
					fullSheet5: material.fullSheet5,
					fullSheet21: material.fullSheet21,
					isa: material.isa,
					distributor: material.distributor,
					manufacturer: material.manufacturer,
					colourGroup: material.colourGroup,
					description: material.description
				},
				addons: [],
				mandatoryCharges: []
			};

	// adds up all mandatory charges for the counter - this might not be used.
			/*for (var i = vm.products.length - 1; i >= 0; i--) {
				if(vm.products[i].category === "mandatory"){
					//console.log(vm.products[i].category);
					pushMandatory = {
						product: vm.products[i].product,
						name: vm.products[i].name,
						price: vm.products[i].price,
						unitOfMeasure: vm.products[i].unitOfMeasure,
						menuType: vm.products[i].menuType,
						quantity: vm.products[i].quantity,
						totalPrice: vm.products[i].totalPrice,
						dropDown:[]
					};
					if(vm.products[i].dropDown[0] !== undefined ){
						for (var j = vm.products[i].dropDown.length - 1; j >= 0; j--) {
							pushMandatoryDropDown = {
								price: vm.products[i].dropDown[j].price,
								product: vm.products[i].dropDown[j].product,
								name: vm.products[i].dropDown[j].name
							}; 	
							pushMandatory.dropDown.push(pushMandatoryDropDown);
						}; 
					};
					pushObj.mandatoryCharges.push(pushMandatory);
				};
			};*/

			//console.log("Push Object", pushObj);

	//Checks the shape of the table, and then calculates square footage.
			if(shape === "rectangle"){
				squareFootage = (length * width/144); //measurements are in inches, then converted to feet
			} else if(shape === "circle"){
				squareFootage = (Math.PI * (Math.pow(width, 2)));
				squareFootage = squareFootage.toFixed(2);
			};
			//console.log(squareFootage, length, width);

	//Calculate how many sheets are needed. Will need to revamp this: check width and length of sheets as well as square footage
			sheets = squareFootage / (material.length * material.width);
			sheets = sheets.toFixed(1);
			//console.log("Sheets: " + sheets);
			//console.log(material);
	//for edit, remember last price and 
	//console.log(material);
	//Chooses the best match for pricing. Will need to make this user selectable later.
			if(sheets <=.5 && material.halfSheet){
			console.log("This ran 1", sheets, material.halfSheet, squareFootage, length, width, material.width, material.length);
				//it will round down to 0, so make it one sheet
				sheets = 1;
				counterPrice = sheets * material.halfSheet;		
				pricing = "halfSheet";
			} else if(sheets <5 && material.fullsheet1){
			console.log("This ran 2");
				counterPrice = sheets * material.fullSheet1;
				pricing = "fullsheet1";
			} else if(sheets <21 && material.fullsheet5){
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

	//Commits data to arrays depending on whether it's an edit or a new save.
			if(typeof index === "undefined"){
				vm.quote.counterGroup[groupIndex].counters.push(pushObj);	
	//Set price of counter minues addons
				vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].totalPrice = counterPrice;
	//Add Pricing default and commit number of 'sheets' required for Counter
				vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].pricing = pricing;
				vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].sheets = sheets;
	//Hides the counter add button at the top of the page.
				vm.hideCounter();
	//Save the price of the counter, and the total price of the vm.quote. Save it to the vm.quote variable.
				vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].material.price = vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].totalPrice;		
				vm.quote.totalPrice += vm.quote.counterGroup[groupIndex].counters[vm.quote.counterGroup[groupIndex].counters.length-1].totalPrice;
			}
			else{
	//Replace the existing addons into the new array :)
	//console.log(vm.quote.counters[index].addons.length);
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
				vm.quote.totalPrice -= vm.quote.counters[index].totalPrice;
				vm.quote.totalPrice += pushObj.totalPrice;
	//replace the counter object with the edited one.
				vm.quote.counterGroup[groupIndex].counters.splice(index, 1, pushObj);

				console.log(vm.quote.counterGroup[groupIndex].counter);
			};

			//vm.quote = vm.quote; - I don't think this is needed anymore, since VM is the view model and is already bound.

			//console.log("Counter Price w/o addons", vm.quote.counters[vm.quote.counters.length-1].material.price);
		};

		vm.deleteCounter = function(index) {
			vm.quote.totalPrice -= vm.quote.counters[index].totalPrice;
			console.log(vm.quote.counters[index].totalPrice);
			vm.quote.counters.splice(index, index+1);
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