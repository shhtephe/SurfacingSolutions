/*
STUFF TO REMEMBER: 
backsplash = item
size will be added by user in counter creation.

linear calculations will be x1 linear foot or x2 linear foot

**linear calc takes into account linear foot of entire group**

In display group cost per sqft

addons are PER GROUP not per table

*/


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
		vm.addCounter = function (groupIndex, counters, size) {
			console.log(groupIndex, counters, size);
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'addcounter.html',
		      controller: ['$uibModalInstance', 'groupIndex', 'counters', addCounterCtrl],
		      controllerAs: 'vm',
		      size: size,
		      resolve: {
		        groupIndex: function() {return groupIndex},
		        counters: function() {return counters}
		        }
      	  	});

      	  	modalInstance.result.then(function (counter) {
				console.log(counter.width, counter.length, counter.shape, counter.counters, counter.groupIndex, counter.description, true);
      			//Save the countertop and put all the data back onto the main controller
      			vm.calcCounter(counter.width, counter.length, counter.shape, counter.counters, counter.groupIndex, counter.description, true);
      			//do the same thing with each addon
      			//console.log(counter.addons, counter.counters)
      			 				
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var addCounterCtrl = function($uibModalInstance, groupIndex, counters) {
	    	var vm = this;
	    	vm.groupIndex = groupIndex;
	    	vm.counters = counters;
	    	console.log(vm.counters, vm.groupIndex);
	    	//remove?
			/*vm.arraySearchModal = function (nameKey, myArray, property){
			    //console.log(nameKey, myArray, property);
			    for (var i=0; i < myArray.length; i++) {
			    	//console.log("my array i", myArray[i], "property", property)
			        if (myArray[i][property] === nameKey) {
			            return i;
			        };
			    };
			};
			*/

	    	vm.saveCounterModal = function(width, length, shape, description, counters, groupIndex) {
	    		console.log(counters, groupIndex);
	    		var counter = {
	    			width: width,
	    			length: length, 
	    			shape: shape, 
	    			description: description,
	    			groupIndex: groupIndex,
	    			counters: counters
	    		};

	    		$uibModalInstance.close(counter);
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

		vm.buildTerms = function(term){
			var terms = vm.quote.terms;
			var pushObj = {};
			console.log("Calendar", term.calendar);
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
					term: term.term,
					calendar: term.calendar
				};
				terms.push(pushObj);
			};
			console.log(terms);
			vm.quote.terms = terms;
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

	  	vm.changePricing = function(pricing, groupNumber, material) {

			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');

			console.log(pricing, groupIndex, material);
			var sheets = vm.quote.counterGroup[groupIndex].sheets;
			var counterPrice = 0;
			var group = vm.quote.counterGroup[groupIndex];
			var addonsTotalPrice = 0;

	  		if(pricing == "halfSheet"){
				counterPrice = sheets * material.halfSheet;		
				vm.quote.counterGroup[groupIndex].material.pricing = "halfSheet";
			} else if(pricing =="fullSheet1"){
				counterPrice = sheets * material.fullSheet1;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet1";
			} else if(pricing == "fullSheet5"){
				counterPrice = sheets * material.fullSheet5;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet5";
			} else if(pricing == "fullSheet21") {
				counterPrice = sheets * material.fullSheet21;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet21";
			} else if(pricing == "isa") {
				counterPrice = sheets * material.isa;
				vm.quote.counterGroup[groupIndex].material.pricing = "isa";
			} else if(pricing == "quarterSheet") {
				counterPrice = sheets * material.quarterSheet;
				vm.quote.counterGroup[groupIndex].material.pricing = "quarterSheet";
			};
			console.log(vm.quote.counterGroup[groupIndex].material.pricing, vm.quote.counterGroup[groupIndex].material); 
			for (var i=0; i < group.addons.length; i++) {
				//console.log("i", i, counter.addons[i]);
	    		addonsTotalPrice += group.addons[i].totalPrice;
			};  

			if( vm.quote.counterGroup[groupIndex].material) {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material, pricing);
			};
	  	};

	  	/*vm.saveMandatoryAddon = function(addon, groupNumber) {
	  		//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
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

		};*/
		vm.removeAddon = function(addon, groupNumber, addonIndex){		
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var counterIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//if groupNumber is -1 it's a mandatory addon and comes from a different array.
			console.log(addon, groupNumber, addonIndex);
			if (groupNumber == -1) {
				vm.quote.totalPrice -= addon.totalPrice;
				vm.quote.mandatoryAddons.splice(addonIndex, 1);
			} else {
				vm.quote.counterGroup[counterIndex].totalPrice -= addon.totalPrice;
				vm.quote.totalPrice -= addon.totalPrice;
				vm.quote.counterGroup[counterIndex].addons.splice(addonIndex, 1);	

			};
			
			//recalculate group if material is present
			if(groupNumber !== -1) {
				vm.calcGroup(groupNumber, vm.quote.counterGroup[groupNumber].material);
			};
		};

		vm.saveAddon = function(addon, shape, TAC, groupIndex) {
			//console.log(typeof vm.quote.counterGroup[groupIndex].addons, addon, shape, length, width, groupIndex);
			console.log(vm.quote.counterGroup[groupIndex], groupIndex, TAC);
			//create addons array if it doesn't exist - for initilization
			if(groupIndex == -1){
				if(typeof vm.quote.mandatoryAddons === "undefined"){
					var addons = [];
				}else{
					var addons = vm.quote.mandatoryAddons;
				};
			} else {
				if(typeof vm.quote.counterGroup[groupIndex].addons === "undefined"){
					var addons = [];
				}else{
					var addons = vm.quote.counterGroup[groupIndex].addons;
				};
			};
			//declare variables
			var pushObj = {};
			//Searches for the item by going through the list
			var search = vm.arraySearch(addon.description, addons, "description");
			//var squareFootage = 0; This should be coming from the group total which gets calculated.

			//if formula is sqft or linear, the quantity is different This is to make the calculating easier, so it's just the quantity that's being handled, not TAC, width, length etc
			if(addon.formula === "sqft"){
				addon.quantity = TAC;
			} else if (addon.formula === "linear"){
				if(groupIndex == -1){
					addon.quantity = vm.quote.totalLength;
				} else {
					addon.quantity = vm.quote.counterGroup[groupIndex].totalLength;
				};
			};

			addon.quantity = Number(addon.quantity);
			//console.log(addon, squareFootage);
			var totalPrice = vm.calcAddon(addon, shape, TAC, groupIndex);

			console.log("This is the total price", totalPrice);
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
					totalPrice: totalPrice
				};
				if(groupIndex == -1) {
					vm.quote.mandatoryAddons.push(pushObj);
					vm.calcMandatoryAddon(vm.quote.mandatoryAddons[vm.quote.mandatoryAddons.length-1]);
					
				} else {
					vm.quote.counterGroup[groupIndex].addons.push(pushObj);
				};
				console.log("Addons:", addons, "pushObj", pushObj, vm.quote);
				
			} else {
				//Found it, so update the value
				if(groupIndex == -1) {
					vm.quote.mandatoryAddons[search].quantity = addon.quantity;
					vm.quote.mandatoryAddons[search].totalPrice = totalPrice;
					vm.calcMandatoryAddon(vm.quote.mandatoryAddons[vm.quote.mandatoryAddons.length-1]);					
				} else {
					vm.quote.counterGroup[groupIndex].addons[search].quantity = addon.quantity;
					vm.quote.counterGroup[groupIndex].addons[search].totalPrice = totalPrice;
				};
			};
			
			if(groupIndex != -1) {
				//recalculate group if material is present
				if( vm.quote.counterGroup[groupIndex].material) {
					vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
				};
			};
		};
		//It's not really calculating, more adding it to the totals
		vm.calcMandatoryAddon = function(addon) {
			vm.quote.totalPrice += addon.totalPrice;
			//update the material and total cost psqf
			vm.quote.GMCPSF = vm.quote.GMC / vm.quote.TAC;
			vm.quote.GCPSF = vm.quote.totalPrice / vm.quote.TAC;
		};

		vm.calcAddon = function(addon, shape, squareFootage, index){
			//var counterLength = length;
			//var counterWidth = width;
			var totalPrice = 0;
			console.log(addon.quantity, addon.price, addon.formula);
			//calculation - need to seperate this into another function
			if (addon.formula === "item") {
				totalPrice =  addon.quantity * addon.price;
			}else if(addon.formula === "sqft"){
				//console.log(vm.quote.counters[index]);
				totalPrice = addon.price * addon.quantity;
			}else if(addon.formula === "linear"){	
					totalPrice = addon.quantity * addon.price;
			}else{
				console.error("Unknown addon formula type!!!", addon.formula);
				totalPrice = addon.quantity * addon.price;
			};
			console.log(totalPrice);
			return(totalPrice);
		};

		vm.addGroup = function() {
			var pushObj = {};

			//check to see if first group
			if(typeof vm.quote.counterGroup[0] === "undefined") {
				pushObj = 
				{
					groupNumber: 0,
					TAC: 0,
					counters: [],
					addons:[],
					totalPrice: 0,
					quantity: 1,
					totalLength: 0
				};
			} else {
				pushObj = {
					groupNumber : vm.quote.counterGroup.length,
					TAC: 0,
					counters: [],
					addons: [],
					totalPrice: 0,
					quantity: 1,
					totalLength: 0
				};
			};
			vm.quote.counterGroup.push(pushObj);
		};

		vm.removeGroup = function(index) {
			console.log(index);
			console.log(vm.quote.counterGroup[index].totalPrice);
			vm.quote.totalPrice -= vm.quote.counterGroup[index].totalPrice;
			vm.quote.counterGroup.splice(index, index+1);
		};


		vm.saveMaterial = function(material, groupNumber){
			console.log(material, groupNumber);
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		console.log(index);
			vm.quote.counterGroup[index].material = {
				itemCode: material.itemCode,
				thickness: material.thickness,
				width: material.width,
				length: material.length,
				halfSheet: material.halfSheet,
				fullSheet1: material.fullSheet1,
				fullSheet5: material.fullSheet5,
				fullSheet21: material.fullSheet21,
				isa: material.isa,
				distributor: material.distributor,
				manufacturer: material.manufacturer,
				colourGroup: material.colourGroup,
				description: material.description
			};
			//console.log(vm.quote.counterGroup[index].material);
			vm.calcGroup(index, material);
		};

		vm.editMaterialSave = function(material, groupNumber){
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			console.log(material, index);
			var pushObj = {};

			//Create an object containing all core counter information, also leaving addons space
			pushObj = {
				itemCode: material.itemCode,
				thickness: material.thickness,
				matWidth: material.width,
				matLength: material.length,
				price: material.price,
				fullSheet1: material.fullSheet1,
				halfSheet: material.halfSheet,
				fullSheet5: material.fullSheet5,
				fullSheet21: material.fullSheet21,
				isa: material.isa,
				distributor: material.distributor,
				manufacturer: material.manufacturer,
				colourGroup: material.colourGroup,
				description: material.description,
				addons: []
			};
			console.log(vm.quote.counterGroup[index]);
			vm.quote.counterGroup[index].material = pushObj;
			//vm.quote.counterGroup[index].material.splice(index, 1, pushObj);
			if( vm.quote.counterGroup[index].material) {
				vm.calcGroup(index, material);
			};
		};

		vm.calcSheets = function(material, sheets, overridePricing){
		//Calculate how many sheets are needed. Will need to revamp this: check width and length of sheets as well as square footage
			var returnObj = {
				sheets : 0,
				pricing: ''
			};

			//console.log(material.length, material.width);
			console.log(typeof overridePricing, sheets);
			if(typeof overridePricing === 'undefined') {
			//Chooses the best match for pricing. Will need to make this user selectable later.
				if(material.fullSheet21 && sheets >= 21) {
					returnObj.pricing = "fullSheet21";
				} else if (material.fullSheet5 && sheets >= 5) {
					returnObj.pricing = "fullSheet5";
				} else if (material.fullSheet1 && sheets >= .51) {
					returnObj.pricing = "fullSheet1";
				} else if (material.halfSheet && sheets >= .26) {
					//it will round down to 0, so make it one sheet
					returnObj.sheets = .5;
					returnObj.pricing = "halfSheet";
				} else if (material.quarterSheet && sheets <= .25) {
					//it will round down to 0, so make it one sheet
					returnObj.sheets = .5;
					returnObj.pricing = "quarterSheet";
				} else {
					returnObj.pricing = "fullSheet1";
				};
			} else {
				console.log("Pricing override");
				returnObj.pricing = overridePricing;
			};
			returnObj.sheets = returnObj.sheets.toFixed(2);
			console.log(returnObj);
			return(returnObj);
		};

		vm.commitCounter = function(modal, pushObj, index, groupNumber){
						//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			console.log(groupIndex, index, typeof vm.quote.counterGroup[groupIndex].counters[index], pushObj);
			//Commits data to arrays depending on whether it's an edit or a new save.
			if(typeof vm.quote.counterGroup[groupIndex].counters[index] === "undefined"){
				//push counter into vm.quote
				vm.quote.counterGroup[groupIndex].counters.push(pushObj);	
			};
			
			console.log(vm.quote);
			console.log(typeof modal, vm.quote.counterGroup[groupIndex].material);
			//recalculate group if material is present
			if(typeof vm.quote.counterGroup[groupIndex].material !== 'undefined') {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
			};
		};

		vm.deleteCounter = function(groupNumber, index) {
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			vm.quote.counterGroup[groupIndex].TAC -= vm.quote.counterGroup[groupIndex].counters[index].squareFootage;
			vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			vm.quote.counterGroup[groupIndex].totalLength -= vm.quote.counterGroup[groupIndex].counters[index].counterLength;
			//console.log(vm.quote.counters[index].totalPrice);
			vm.quote.counterGroup[groupIndex].counters.splice(index, index+1);
			//recalculate group if material is present
			if(typeof vm.quote.counterGroup[groupIndex].material !== 'undefined') {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
			};
		};

		vm.calcGroup = function(groupNumber, material, overridePricing){
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			//So I think this is going to be more of a 'hub' for all the update functions: calculate sheets, calculate counters, calculate addons etc etc.
			//It'll check to see what data it has, and then will calculate what it can. Will probably need to make a flag set when all the info is there
			//So it'll catch you if click on the quote page with missing info "Quote is incomplete - group 1 requires material. Are you sure you want to continue?"
			console.log(isNaN(parseFloat(vm.quote.counterGroup[index].sheets)), typeof vm.quote.counterGroup[index].sheets);
			//If sheets entered is not a number or undefined, don't calculate.
			if(isNaN(parseFloat(vm.quote.counterGroup[index].sheets)) === false || typeof vm.quote.counterGroup[index].sheets === "undefined"){
				var group = vm.quote.counterGroup[index];
				var sheets = {};

				console.log(vm.quote.counterGroup[index]);
				console.log(index);
				//clear values for each counter and the main group
				vm.quote.counterGroup[index].TAC = 0;
				vm.quote.TAC = 0;
				vm.quote.totalPrice = 0;
				//Go through each counter and add up all area values.
				for (var i = 0; i <= vm.quote.counterGroup[index].counters.length - 1; i++) {
					//Add square footage of one counter to the TOTAL Area
					//console.log(i, vm.quote.counterGroup[index].counters.length, vm.quote.counterGroup[index].counters[i].squareFootage);
					vm.quote.counterGroup[index].TAC += vm.quote.counterGroup[index].counters[i].squareFootage * vm.quote.counterGroup[index].quantity;
					vm.quote.TAC += parseFloat(vm.quote.counterGroup[index].counters[i].squareFootage);
				};
				
				//Round 'em.
				vm.quote.counterGroup[index].TAC = vm.quote.counterGroup[index].TAC.toFixed(2);
				vm.quote.TAC = parseFloat(vm.quote.TAC.toFixed(2));

				//If the sheets have not been overriden, take entire area and estimate number of sheets required. ELSE just multiple by the quantity!
				if(typeof vm.quote.counterGroup[index].sheets === "undefined") {
					vm.quote.counterGroup[index].sheets = (vm.quote.counterGroup[index].TAC / (material.length * material.width/144)) * vm.quote.counterGroup[index].quantity;
					vm.quote.counterGroup[index].sheets = vm.quote.counterGroup[index].sheets.toFixed(2);	
				};
				//multiply the estimated sheets by the quantity
				vm.quote.counterGroup[index].estimatedSheets = vm.quote.counterGroup[index].sheets * vm.quote.counterGroup[index].quantity;
				
				console.log(parseFloat(vm.quote.counterGroup[index].sheets));

				//Below is the math for taking the total area of the group and getting pricing/estimating charges. The sheet estimation will be overriden when there's the sheets have been entered.
				sheets = vm.calcSheets(material, vm.quote.counterGroup[index].sheets, overridePricing);
				vm.quote.counterGroup[index].material.pricing = sheets.pricing;
				vm.quote.counterGroup[index].totalPrice = vm.quote.counterGroup[index].sheets * material[sheets.pricing] * vm.quote.counterGroup[index].quantity;	

				//calculate addons in group
				for(var i = 0; i < vm.quote.counterGroup[index].addons.length; i++) {
					//console.log(vm.quote.counterGroup[index].addons[i], i, index);
					vm.quote.counterGroup[index].totalPrice += vm.quote.counterGroup[index].addons[i].totalPrice * vm.quote.counterGroup[index].quantity;
					vm.quote.totalPrice += vm.quote.counterGroup[index].addons[i].totalPrice * vm.quote.counterGroup[index].quantity;
				};	

				//calculate Mandatory Addons
				for(var i = 0; i < vm.quote.mandatoryAddons.length; i++) {
					vm.quote.totalPrice += vm.quote.mandatoryAddons[i].totalPrice * vm.quote.counterGroup[index].quantity;
				};	

				console.log(material[sheets.pricing], vm.quote.counterGroup[index].sheets);
				//Group MATERIAL Cost - Cost of all counters combined
				vm.quote.counterGroup[index].GMC = material[sheets.pricing] * vm.quote.counterGroup[index].sheets * vm.quote.counterGroup[index].quantity;
				vm.quote.totalPrice += vm.quote.counterGroup[index].GMC;
				vm.quote.GMC = vm.quote.counterGroup[index].GMC;
				vm.quote.totalLength = parseFloat(vm.quote.counterGroup[index].totalLength);

				// GMC square foot total divided by the total area of sheets required
				vm.quote.counterGroup[index].GMCPSF = vm.quote.counterGroup[index].GMC / vm.quote.counterGroup[index].TAC;
				//Group Cost per Squarefoot
				console.log("gmc", vm.quote.counterGroup[index].GMC, "tac", vm.quote.counterGroup[index].TAC, "totalPrice (tgc)", vm.quote.counterGroup[index].totalPrice);
				vm.quote.counterGroup[index].GCPSF = vm.quote.counterGroup[index].totalPrice / vm.quote.counterGroup[index].TAC;
				
				//This is for after it's calculated once, because it adds up all OTHER counters, and then adds the new value for group total 
				if(typeof vm.quote.counterGroup[index].totalPrice !== 'undefined'){
					for (var t = vm.quote.counterGroup.length - 1; t >= 0; t--) {
						if(t !== index){
							vm.quote.TAC += parseFloat(vm.quote.counterGroup[t].TAC);
							vm.quote.totalPrice += parseFloat(vm.quote.counterGroup[t].totalPrice);
							vm.quote.GMC += parseFloat(vm.quote.counterGroup[t].GMC);
							vm.quote.totalLength += parseFloat(vm.quote.counterGroup[t].totalLength);
						};	
					};
					vm.quote.GMCPSF = vm.quote.GMC / vm.quote.TAC;
					vm.quote.GCPSF = vm.quote.totalPrice / vm.quote.TAC;
				};	
			};	
		};

		vm.calcCounter = function(width, length, shape, index, groupNumber, description, modal) {
		//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  	var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
		console.log("Width", width, "Length", length, "Shape", shape, "Index", index, "Group Index", groupIndex, "description", description);

		//Obviously, we set some variables. 
			var squareFootage = 0;
			var lastPrice = 0;
			var counterPrice = 0;
			var totalPrice = 0;
			var pushObj = {};
//			var pushMandatory = {};
//			var pushMandatoryDropDown = {};
			var pricing = "";
//			var counterIndex = vm.quote.counterGroup[groupIndex].counters.length;

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
				squareFootage: 0,
				counterPrice: 0
			};

			//console.log("Push Object", pushObj);

			//Checks the shape of the table, and then calculates square footage.
			if(shape === "rectangle"){
				pushObj.squareFootage = (length * width/144); //measurements are in inches, then converted to feet
			} else if(shape === "circle"){
				pushObj.squareFootage = (Math.PI * (Math.pow(width, 2)))/144;
				console.log(pushObj.squareFootage);
			};

			vm.quote.counterGroup[groupNumber].totalLength += parseFloat(length);
			console.log(pushObj.squareFootage);
			//"Save" the counter to vm.quote
			vm.commitCounter(modal, pushObj, index, groupIndex);
		};


		vm.saveQuote = function() {
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