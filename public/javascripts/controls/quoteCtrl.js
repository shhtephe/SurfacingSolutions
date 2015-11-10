(function() {
	'use strict';
 
	angular.module('surfacingSolutions')
	.controller('quoteCtrl', quoteCtrl);

	quoteCtrl.$inject = ['dataFactory', '$stateParams'];

	function quoteCtrl(dataFactory, $stateParams) {
		//'this' replaces $scope
		var vm = this;

		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;

		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.customer = data.customer;
				vm.products = data.products,
				vm.materials = data.materials
			},
			function(reason) {
				console.log(reason);
			});
				


		vm.mandatoryChargeChange = function(product, price, quantity, quote, counter, parentIndex, index){
			var charges = quote.counters[parentIndex].mandatoryCharges[index];
	 		var oldPrice = 0;
	 		if(charges.totalPrice !== undefined){
	 			oldPrice = charges.totalPrice;	
	 		};
	 		charges.totalPrice = quantity * price;
	 		quote.counters[parentIndex].totalPrice += - oldPrice + charges.totalPrice;
	 		quote.totalPrice += - oldPrice + charges.totalPrice;
	 		console.log(quote.counters[parentIndex].mandatoryCharges[index]);
	 		vm.quote = quote;

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
			console.log(vm.mandatoryForm);
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

		function arraySearch(nameKey, myArray){
		    for (var i=0; i < myArray.length; i++) {
		        if (myArray[i].product === nameKey) {
		            return i;
		        };
		    };
		};

		vm.saveAddon = function(quote, addon, index) {
			var addons = quote.counters[index].addons;
			var pushObj = {};
			var shape = quote.counters[index].counterShape;
			console.log(addon);

			var totalPrice = 0;
			var counterLength = quote.counters[index].counterLength;
			var counterWidth = quote.counters[index].counterWidth;
			var squareFootage = 0;

			console.log(addon.formula, addon.quantity, addon.price);
			if (addon.formula === "item") {
				totalPrice =  addon.quantity * addon.price;
			}else if(addon.formula === "square"){
				console.log(quote.counters[index]);
				if(shape === "rectangle"){
					squareFootage = counterLength * counterWidth;
					totalPrice = addon.price * squareFootage;
					console.log(counterLength, counterWidth, squareFootage, totalPrice, addon.price);
				} else if(shape === "circle"){
					squareFootage = (counterWidth*counterWidth) * Math.PI;
					squareFootage = squareFootage.toFixed(2);
					totalPrice = addon.price * squareFootage;
				};
			}else if(addon.formula === "linear"){	
					totalPrice = addon.linear * price;
			}else{
				console.log("This shouldn't ever run, I think!");
				totalPrice = addon.quantity * addon.price;
			};

			//Searches for the item by going through the list
			var result = $.grep(addons, function(e){ return e.itemCode === addons.itemCode; });
			console.log("This is the result: ", result);
			console.log(Object.keys(result).length)
			if (Object.keys(result).length == 0) {
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
				console.log("Addons:", addons);
				console.log("pushObj", pushObj);
				quote.counters[index].totalPrice += addons[addons.length-1].totalPrice;
			} else {
				//Found it, so update the value
				addons[arraySearch(addon.description, addons)].quantity = addon.quantity;
				addons[arraySearch(addon.description, addons)].totalPrice = totalPrice;
				quote.counters[index].totalPrice += addons[arraySearch(addon.description, addons)].totalPrice;
			};

			vm.dropDown1 = "";
			vm.dropDown2 = "";
			vm.addonQuantity = "";
			console.log(quote.totalPrice, totalPrice);
			quote.totalPrice += totalPrice;
			vm.quote = quote;
			//updatePrice(quantity, price, "addon"); - For use later
			//vm.hideAddons();
		};	
		
		vm.removeAddon = function(addon, counterIndex, addonIndex, quote){		
			quote.totalPrice -= addon.totalPrice;
			quote.counters[counterIndex].totalPrice -= addon.totalPrice;
			quote.counters[counterIndex].addons.splice(addonIndex, 1);
		};

		vm.saveEditCounter = function(index){
			console.log(vm.quote.counters[index], index);
		};

		vm.saveCounter = function(quote, width, length, shape, material, products, index) {
	//console.log("Width", width, "Length", length, "Shape", shape, "Material", material, "Index", index);

	//Obviously, we set some variables. 
			var squareFootage = 0;
			var sheets = 0;
			var lastPrice = 0;
			var counterPrice = 0;
			var totalPrice = 0;
			var pushObj = {};
			var pushMandatory = {};
			var pushMandatoryDropDown = {};

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
			for (var i = products.length - 1; i >= 0; i--) {
				if(products[i].category === "mandatory"){
					//console.log(products[i].category);
					pushMandatory = {
						product: products[i].product,
						name: products[i].name,
						price: products[i].price,
						unitOfMeasure: products[i].unitOfMeasure,
						menuType: products[i].menuType,
						quantity: products[i].quantity,
						totalPrice: products[i].totalPrice,
						dropDown:[]
					};
					if(products[i].dropDown[0] !== undefined ){
						for (var j = products[i].dropDown.length - 1; j >= 0; j--) {
							pushMandatoryDropDown = {
								price: products[i].dropDown[j].price,
								product: products[i].dropDown[j].product,
								name: products[i].dropDown[j].name
							}; 	
							pushMandatory.dropDown.push(pushMandatoryDropDown);
						}; 
					};
					pushObj.mandatoryCharges.push(pushMandatory);
				};
			};

			//console.log("Push Object", pushObj);

	//Checks the shape of the table, and then calculates square footage.
			if(shape === "rectangle"){
				squareFootage = length * width;
			} else if(shape === "circle"){
				squareFootage = (length*width) * Math.PI;
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
			console.log("This ran 1", sheets, material.halfSheet);
				counterPrice = sheets * material.halfSheet;			
			} else if(sheets <5 && material.fullsheet1){
			console.log("This ran 2");
				counterPrice = sheets * material.fullSheet1;
			} else if(sheets <21 && material.fullsheet5){
			console.log("This ran 3");
				counterPrice = sheets * material.fullSheet5;
			} else if(sheets >=21 && material.fullSheet21) {
			console.log("This ran 4");
				counterPrice = sheets * material.fullSheet21;
			} else {
			console.log("This ran 5", sheets, material.fullSheet1);
				counterPrice = sheets * material.fullSheet1;
			}

	//Commits data to arrays depending on whether it's an edit or a new save.
			if(typeof index === "undefined"){
	//Set price of counter minues addons
				quote.counters[quote.counters.length-1].totalPrice = counterPrice;

				quote.counters.push(pushObj);
	//Hides the counter add button at the top of the page.
				vm.hideCounter();
	//Save the price of the counter, and the total price of the quote. Save it to the $Scope.quote variable.
				quote.counters[quote.counters.length-1].material.price = quote.counters[quote.counters.length-1].totalPrice;		
				quote.totalPrice += quote.counters[quote.counters.length-1].totalPrice;
			}
			else{
	//Replace the existing addons into the new array :)
				for (var i = quote.counters[index].addons.length - 1; i >= 0; i--) {
					pushObj.addons.push(quote.counters[index].addons[i]);6
					pushObj.totalPrice += quote.counters[index].addons[i].totalPrice;
				};
	//Replace counter total.
				pushObj.material.price = counterPrice;
				pushObj.totalPrice += counterPrice;
	//Add Quote total with new counter price but first replace old price.		
				quote.totalPrice -= quote.counters[index].totalPrice;
				quote.totalPrice += pushObj.totalPrice;
	//replace the counter object with the edited one.
				quote.counters.splice(index, 1, pushObj);
			};

			vm.quote = quote;

			//console.log("Counter Price w/o addons", quote.counters[quote.counters.length-1].material.price);
		};

		vm.deleteCounter = function(quote, index) {
			quote.totalPrice -= quote.counters[index].totalPrice;
			console.log(quote.counters[index].totalPrice);
			quote.counters.splice(index, index+1);
	//I don't think I need a refresh		$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
		};

		vm.saveQuote = function(quote, description) {

			//console.log(quote.jobDifficulty.$dirty);
			if(quote.jobDifficulty.$dirty === true){
				console.log("value has changed");
			};

			quote['description'] = description;
			//save the quote
			//Need to declare that it's sending a json doc
			$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
			$http.post('/savequote', {"quote":quote}).
	  		success(function(data, status, headers, config) {
		    	// this callback will be called asynchronously
		    	// when the response is available
				console.log(quote);
		    	vm.addAlert("success", "Quote saved Successfully");
		  	}).
	  		error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				vm.addAlert("danger", "Error: Quote did not save");
	  		});
		};
	};
}());