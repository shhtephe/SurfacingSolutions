'use strict';
 
app.controller('quoteCtrl',
  ['$scope', '$state', '$http',  function ($scope, $state, $http) {
  	function updatePrice() {

  	};
	$scope.mandatoryChargeChange = function(product, price, quantity, quote, counter, parentIndex, index){
		var charges = quote.counters[parentIndex].mandatoryCharges[index];
 		var oldPrice = 0;
 		if(charges.totalPrice !== undefined){
 			oldPrice = charges.totalPrice;	
 		};
 		charges.totalPrice = quantity * price;
 		quote.counters[parentIndex].totalPrice += - oldPrice + charges.totalPrice;
 		quote.totalPrice += - oldPrice + charges.totalPrice;
 		console.log(quote.counters[parentIndex].mandatoryCharges[index]);
 		$scope.quote = quote;

	};

	$scope.hideAddons = function(index) {  
		console.log($scope);
		/*$scope.counterAddonDistributor = "";
		$scope.counterAddonManufacturer = "";
		$scope.counterAddonType = "";
		$scope.counterAddonDescription = "";*/
		$scope.quoteForm.counterAddonDescription.quantity = "";
	};

	$scope.showCounter = function() {  
		$scope.addCounter = true;
	};

	$scope.hideCounter = function() {  
		$scope.addCounter = false;
		$scope.shape = "",
		$scope.counterWidth = "",
		$scope.counterLength = "",
		$scope.materialColourGroup = "",
		$scope.materialDistributor = "", 
		$scope.materialManufacturer = "",
		$scope.materialColourGroup = "";
	};

	$scope.alerts = [];

  	$scope.addAlert = function(type, msg) {
	    $scope.alerts.push({
	    	type: type,
	    	msg: msg
	    });
  	};

  	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
  	};

	function arraySearch(nameKey, myArray){
	    for (var i=0; i < myArray.length; i++) {
	        if (myArray[i].product === nameKey) {
	            return i;
	        };
	    };
	};

	$scope.saveAddon = function(quote, addon, index) {
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
				squareFootage = length * width;
				totalPrice = price * squareFootage;
				console.log(length, width, squareFootage, totalPrice, price);
			} else if(shape === "circle"){
				squareFootage = (width*width) * Math.PI;
				squareFootage = squareFootage.toFixed(2);
				totalPrice = price * squareFootage;
			};
		}else if(addon.formula === "linear"){	
				totalPrice = addon.linear * price;
		}else{
			totalPrice = quantity * price;
		};

		//Searches for the item by going through the list
		var result = $.grep(addons, function(e){ return e.itemCode === addons.itemCode; });
		console.log("This is the result: ", result);
		console.log(Object.keys(result).length)
		if (Object.keys(result).length === 0) {
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
			console.log(addons);
			quote.counters[index].totalPrice += addons[addons.length-1].totalPrice;
			console.log(pushObj);
		} else {
			//Found it, so update the value
			addons[arraySearch(addon.description, addons)].quantity = addon.quantity;
			addons[arraySearch(addon.description, addons)].totalPrice = totalPrice;
			quote.counters[index].totalPrice += addons[arraySearch(addon.description, addons)].totalPrice;
		};

		$scope.dropDown1 = "";
		$scope.dropDown2 = "";
		$scope.addonQuantity = "";
		quote.totalPrice += quote.counters[index].totalPrice;
		$scope.quote = quote;
		//updatePrice(quantity, price, "addon"); - For use later
		$scope.hideAddons();
	};	
	
	$scope.removeAddon = function(addon, counterIndex, addonIndex, quote){		
		quote.totalPrice -= addon.totalPrice;
		quote.counters[counterIndex].totalPrice -= addon.totalPrice;
		quote.counters[counterIndex].addons.splice(addonIndex, 1);
	};

	$scope.saveCounter = function(quote, width, length, shape, material, products) {
		var squareFootage = 0;
		var pushObj = {};
		var pushMandatory = {};
		var pushMandatoryDropDown = {};
		var sheets = 0;
		if($scope.shape == "circle"){
			length = 0;
		}
		console.log(width + "/" + length + "/" + shape + "/" + material.colourGroup + "/" + material.description + "/" + material.fullSheet1)
		console.log("width: " + width + "/length: " + length);
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
		console.log(products);
		// adds up all mandatory charges for the counter
		for (var i = products.length - 1; i >= 0; i--) {
			if(products[i].category === "mandatory"){
				console.log(products[i].category);
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
		console.log(pushObj);
		quote.counters.push(pushObj);
		console.log(quote.counters);

		$scope.hideCounter();
		
		if(shape === "rectangle"){
			squareFootage = length * width;
		} else if(shape === "circle"){
			squareFootage = (width*width) * Math.PI;
			squareFootage = squareFootage.toFixed(2);
		};
		console.log(squareFootage, length, width);
		//update total price
		sheets = squareFootage / (material.length * material.width);
		sheets = sheets.toFixed(0);
		console.log("Sheets: " + sheets);
		console.log(material);

		if(sheets <=.5 && material.halfSheet){
		console.log("This ran 1");
			quote.counters[quote.counters.length-1].totalPrice = sheets * material.halfSheet;			
		} else if(sheets <5 && material.fullsheet1){
		console.log("This ran 2");
			quote.counters[quote.counters.length-1].totalPrice = sheets * material.fullSheet1;
		} else if(sheets <21 && material.fullsheet5){
		console.log("This ran 3");
			quote.counters[quote.counters.length-1].totalPrice = sheets * material.fullSheet5;
		} else if(sheets >=21 && material.fullSheet21) {
		console.log("This ran 4");
			quote.counters[quote.counters.length-1].totalPrice = sheets * material.fullSheet21;
		} else {
		console.log("This ran 5");
			//console.log(quote.counters[quote.counters.length-1].totalPrice, sheets, material.fullSheet1);
			quote.counters[quote.counters.length-1].totalPrice = sheets * material.fullSheet1;
		}
		console.log(quote.counters[quote.counters.length-1].totalPrice);
		
		quote.totalPrice = quote.totalPrice + quote.counters[quote.counters.length-1].totalPrice;
		$scope.quote = quote;
	};

	$scope.deleteCounter = function(quote, index) {
		quote.totalPrice -= quote.counters[index].totalPrice;
		console.log(quote.counters[index].totalPrice);
		quote.counters.splice(index, index+1);
//I don't think I need a refresh		$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
	};

	$scope.saveQuote = function(quote, description) {
		
		console.log($scope);

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
	    	$scope.addAlert("success", "Quote saved Successfully");
	  	}).
  		error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			$scope.addAlert("danger", "Error: Quote did not save");
  		});
	};
}]);