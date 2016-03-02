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
			console.log("Term", term, "Terms", terms);
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

	  	vm.changePricing = function(pricing, groupIndex, material) {
		console.log(pricing, groupIndex, material);
		var sheets = vm.quote.counterGroup[groupIndex].sheets;
		var counterPrice = 0;
		var group = vm.quote.counterGroup[groupIndex];
		var addonsTotalPrice = 0;

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

			for (var i=0; i < group.addons.length; i++) {
      				//console.log("i", i, counter.addons[i]);
			    	addonsTotalPrice += group.addons[i].totalPrice;
			    };  


			//remove the price of the entire counter
			vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			//set new value with addons added to price
			vm.quote.counterGroup[groupIndex].counters[index].totalPrice = counterPrice + addonsTotalPrice;
			//update new grand total
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

		vm.saveAddon = function(addon, shape, length, width, groupIndex) {
			console.log(typeof vm.quote.counterGroup[groupIndex].addons);

			if(typeof vm.quote.counterGroup[groupIndex].addons === "undefined"){
				var addons = [];
			}else{
				var addons = vm.quote.counterGroup[groupIndex].addons;
			};
			var pushObj = {};
			var search = vm.arraySearch(addon.description, addons, "description");
			var totalPrice = 0;
			var counterLength = length;
			var counterWidth = width;
			var squareFootage = 0;
			addon.quantity = Number(addon.quantity);
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
					productType: addon.type,
					description: addon.description,
					itemCode: addon.itemCode,
					price: addon.price,
					formula: addon.formula,
					quantity: addon.quantity,
					totalPrice: totalPrice
				};

				console.log("Addons:", addons, "pushObj", pushObj, vm.quote);

				vm.quote.counterGroup[groupIndex].addons.push(pushObj);

				totalPrice += vm.quote.counterGroup[groupIndex].addons[vm.quote.counterGroup[groupIndex].addons.length-1].totalPrice;
			} else {
				//Found it, so update the value
				vm.quote.counterGroup[groupIndex].addons[search].quantity = addon.quantity;
				vm.quote.counterGroup[groupIndex].addons[search].totalPrice = totalPrice;
				//below code will be done when modal is saved and we're back on the normal page
				//vm.quote.counters[index].totalPrice += addons[search].totalPrice;
			};

		};
		
		vm.removeAddon = function(addon, counterIndex, addonIndex){		
			vm.quote.totalPrice -= addon.totalPrice;
		
			vm.quote.counterGroup[counterIndex].totalPrice -= addon.totalPrice;
			vm.quote.counterGroup[counterIndex].addons.splice(addonIndex, 1);
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
					totalPrice: 0
				};
			} else {
				pushObj = {
					groupNumber : vm.quote.counterGroup.length,
					TAC: 0,
					counters: [],
					addons: [],
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
			//console.log(material);

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

		vm.editMaterialSave = function(material, index){
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

		};

		vm.calcSheets = function(material, sheets){
		//Calculate how many sheets are needed. Will need to revamp this: check width and length of sheets as well as square footage


			var returnObj = {
				sheets : 0,
				pricing: '',
				counterPrice: 0
			};

			//console.log(material.length, material.width);
		//Chooses the best match for pricing. Will need to make this user selectable later.
			if(material.fullSheet21 && sheets >= 21) {
//				returnObj.counterPrice = sheets * material.fullSheet21;
				returnObj.pricing = "fullSheet21";
			} else if (material.fullSheet5 && sheets > 5) {
//				returnObj.counterPrice = sheets * material.fullSheet5;
				returnObj.pricing = "fullSheet5";
			} else if (material.fullSheet1 && sheets >= 1) {
//				returnObj.counterPrice = sheets * material.fullSheet1;
				returnObj.pricing = "fullSheet1";
			} else if (material.halfSheet && sheets < .5) {
				//it will round down to 0, so make it one sheet
				returnObj.sheets = .5;
//				returnObj.counterPrice = sheets * material.halfSheet;		
				returnObj.pricing = "halfSheet";
			} else {
//				returnObj.counterPrice = sheets * material.fullSheet1;
				returnObj.pricing = "fullSheet1";
			};
			returnObj.sheets = returnObj.sheets.toFixed(2);
			console.log(returnObj);
			return(returnObj);
		};

		vm.commitCounter = function(modal, pushObj, index, groupIndex){
			console.log(groupIndex, index, typeof vm.quote.counterGroup[groupIndex].counters[index]);
			//Commits data to arrays depending on whether it's an edit or a new save.
			if(typeof vm.quote.counterGroup[groupIndex].counters[index] === "undefined"){
				//push counter into vm.quote
				vm.quote.counterGroup[groupIndex].counters.push(pushObj);	
			} else{
	//Replace the existing addons into the new array :)
				if(typeof vm.quote.counterGroup[groupIndex].counters[index].addons !== "undefined") {
					for (var i = vm.quote.counterGroup[groupIndex].counters[index].addons.length - 1; i >= 0; i--) {
						pushObj.addons.push(vm.quote.counterGroup[groupIndex].counters[index].addons[i]);6
					pushObj.totalPrice += vm.quote.counterGroup[groupIndex].counters[index].addons[i].totalPrice;
					};
				};
				console.log(sheets);
	//Replace counter total.
				pushObj.matPrice = counterPrice;
				pushObj.totalPrice += counterPrice;
	//Add Pricing default and commit number of 'sheets' required for Counter
				pushObj.pricing = sheets.pricing;
				pushObj.sheets = sheets.sheets;
	//Add vm.quote total with new counter price but first replace old price.		
				vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
				vm.quote.totalPrice += pushObj.totalPrice;
				vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
				vm.quote.counterGroup[groupIndex].totalPrice += pushObj.totalPrice;
	//replace the counter object with the edited one.
				vm.quote.counterGroup[groupIndex].counters.splice(index, 1, pushObj);

			};
			console.log(vm.quote);
			console.log(typeof modal);
			//vm.quote = vm.quote; - I don't think this is needed anymore, since VM is the view model and is already bound.

			//console.log("Counter Price w/o addons", vm.quote.counters[vm.quote.counters.length-1].material.price);
		};

		vm.deleteCounter = function(groupIndex, index) {
			vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			vm.quote.counterGroup[groupIndex].TAC -= vm.quote.counterGroup[groupIndex].counters[index].squareFootage;
			vm.quote.totalPrice-= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			//console.log(vm.quote.counters[index].totalPrice);
			vm.quote.counterGroup[groupIndex].counters.splice(index, index+1);
		};

		vm.calcGroup = function(index, material){
			//So I think this is going to be more of a 'hub' for all the update functions: calculate sheets, calculate counters, calculate addons etc etc.
			//It'll check to see what data it has, and then will calculate what it can. Will probably need to make a flag set when all the info is there
			//So it'll catch you if click on the quote page with missing info "Quote is incomplete - group 1 requires material. Are you sure you want to continue?"

			var group = vm.quote.counterGroup[index];
			var sheets = {};

			//Group MATERIAL Cost - Cost of all counters combined
			var GMC = 0;
			// GMC square foot total divided by the total area of sheets required
			var GMCPSF = 0;
			// Total Group Cost - addons + GMC
			var TGC = 0;
			//Group Cost per Squarefoot
			var GCPSF = 0;

			//calculate all addons for group. go through each table
			//There's a fuckton more to go in this bit. Likely will be it's own function.
			/*
			for (var c=0; i< counters.length; c++){
				for (var i=0; i < counters[c].addons.length; i++) {
      				//console.log("i", i, counter.addons[i]);
			    	vm.saveAddon(counter.addons[i], counter.counters, counter.groupIndex)
				};	
			};
			 */

			vm.quote.counterGroup[index].sheets = 0; 
			
			for (var i = 0; i <= vm.quote.counterGroup[index].counters.length - 1; i++) {
				console.log("i " + i);
				//Add square footage of one counter to the TOTAL Area
				vm.quote.counterGroup[index].TAC += vm.quote.counterGroup[index].counters[i].squareFootage
				//Estimate number of sheets needed for counter and add it to total sheets for the group
				//this can be done in the calcsheets function
				vm.quote.counterGroup[index].sheets += vm.quote.counterGroup[index].counters[i].squareFootage / (material.length * material.width/144);
				console.log("Sheets: " + vm.quote.counterGroup[index].sheets);
				//Add square footage of one counter to the TOTAL Area
				vm.quote.counterGroup[index].TAC += vm.quote.counterGroup[index].counters[i].squareFootage;
				//Set price of counter minus addons
				var pricing = vm.quote.counterGroup[index].material.pricing;
				vm.quote.counterGroup[index].counters[i].totalPrice = sheets.sheets * material[pricing];	
				//console.log("group " + index, "counter " + i, "total price " + vm.quote.counterGroup[index].counters[i].totalPrice, "material price " + material[pricing], "Sheets " + sheets.sheets);			
				//Save the price of the counter, and the total price of the vm.quote. Save it to the vm.quote variable.
				vm.quote.totalPrice += vm.quote.counterGroup[index].counters[i].totalPrice;
				vm.quote.counterGroup[index].totalPrice += vm.quote.counterGroup[index].counters[i].totalPrice;

/*
				console.log("counter " + i, "SqFt " + vm.quote.counterGroup[index].counters[i].squareFootage, "length" + material.length,"width " + material.width, "sheets " + vm.quote.counterGroup[index].sheets);
				//Estimate number of sheets needed for counter and add it to total sheets for the group
				vm.quote.counterGroup[index].sheets += vm.quote.counterGroup[index].counters[i].squareFootage / (material.length * material.width/144);
				console.log("Sheets: " + vm.quote.counterGroup[index].sheets);
				//Calculate which pricing model should be used given the number of sheets.
				sheets = vm.calcSheets(material, vm.quote.counterGroup[index].sheets);
				vm.quote.counterGroup[index].sheets = sheets.sheets;
				//vm.quote.counterGroup[index].sheets = vm.quote.counterGroup[index].sheets.toFixed(1);
				//Add square footage of one counter to the TOTAL Area
				vm.quote.counterGroup[index].TAC += vm.quote.counterGroup[index].counters[i].squareFootage
				//Set price of counter minus addons
				vm.quote.counterGroup[index].counters[i].totalPrice = sheets.counterPrice;
				//Add Pricing default and commit number of 'sheets' required for Counter
				vm.quote.counterGroup[index].material.pricing = sheets.pricing;
				vm.quote.counterGroup[index].sheets = sheets.sheets;
				//Save the price of the counter, and the total price of the vm.quote. Save it to the vm.quote variable.
				console.log("Counter " + i + " total price: " + vm.quote.counterGroup[index].counters[i].totalPrice);
				console.log("Pricing", pricing, "Material price", material[pricing], "Sheets", sheets.sheets);
				vm.quote.counterGroup[index].counters[i].totalPrice = sheets.sheets * material[pricing];
				vm.quote.totalPrice += vm.quote.counterGroup[index].counters[i].totalPrice;
				vm.quote.counterGroup[index].totalPrice += vm.quote.counterGroup[index].counters[i].totalPrice;
				//calculate counter price
				var pricing = vm.quote.counterGroup[index].material.pricing;
				console.log("sheets " + sheets, "sheets.sheets " + vm.quote.counterGroup[index].sheets, "TAC " + vm.quote.counterGroup[index].TAC, "counter total price" + vm.quote.counterGroup[index].counters[i].totalPrice, vm.quote.counterGroup[index].material.pricing);
*/
			};

			//Calculate which pricing model should be used given the number of sheets.
				sheets = vm.calcSheets(material, vm.quote.counterGroup[index].sheets);
				vm.quote.counterGroup[index].material.pricing = sheets.pricing;
			//might not need			vm.quote.counterGroup[index].TAC = vm.quote.counterGroup[index].TAC.toFixed(1)
			console.log(vm.quote.counterGroup[index].TAC);

			//STILL HAVE TO CALC ADDONS
			for(var i = 0; i < vm.quote.counterGroup[index].addons.length; i++) {
				console.log(vm.quote.counterGroup[index].addons[i], i, index);
				vm.quote.counterGroup[index].totalPrice += vm.quote.counterGroup[index].addons[i].totalPrice;
				vm.quote.totalPrice += vm.quote.counterGroup[index].addons[i].totalPrice;
			};

			//Calc material pricing
			if(typeof material !== "undefined"){
				console.log("There is a material");
			};

			if(typeof vm.quote.counterGroup[index].counter !== "undefined") {
				console.log("There's at least one counter");
				//vm.calcCounter = function(width, length, shape, index, groupIndex, description, modal);
			};

		};

		vm.calcCounter = function(width, length, shape, index, groupIndex, description, modal) {
		console.log("Width", width, "Length", length, "Shape", shape, "Index", index, "Group Index", groupIndex, "description", description);

		//Obviously, we set some variables. 
			var squareFootage = 0;
			var lastPrice = 0;
			var counterPrice = 0;
			var totalPrice = 0;
			var pushObj = {};
			var pushMandatory = {};
			var pushMandatoryDropDown = {};
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
				price: 0
			};
			//might not use this.
			if(typeof vm.quote.counterGroup[groupIndex].material !== "undefined"){

			};
			//console.log("Push Object", pushObj);

	//Checks the shape of the table, and then calculates square footage.
			if(shape === "rectangle"){
				pushObj.squareFootage = (length * width/144); //measurements are in inches, then converted to feet
			} else if(shape === "circle"){
				pushObj.squareFootage = (Math.PI * (Math.pow(width, 2)));
			};

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