'use strict';
 
app.controller('quoteCtrl',
  ['$scope', '$state', '$http',  function ($scope, $state, $http) {
  	function updatePrice() {

  	};

	$scope.showCounter = function() {  
		$scope.addCounter = true;
	};

	$scope.hideCounter = function() {  
		$scope.addCounter = false;
		$scope.shape = "";
		$scope.counterWidth = "";
		$scope.counterLength = "";
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

	$scope.saveAddon = function(quote, index, name, product, price, quantity, dropDown) {
		var addons = quote.counters[index].addons;
		var pushObj = {};
		var result = $.grep(addons, function(e){ return e.product === product; });
		var totalPrice = 0;
		
		console.log();

		if (typeof dropDown !== 'undefined') {
			totalPrice = quote.counters[index].length * dropDown.price;
		}else{
			totalPrice = quantity * price;
		};
		
		if (Object.keys(result).length === 0) {
			//Couldn't find it, so add a new value
			pushObj = {
				name: name,
				product: product,
				quantity: quantity,
				price: price,
				totalPrice: totalPrice,
				dropDown: dropDown
			};
			addons.push(pushObj);
			console.log(addons);
			quote.counters[index].totalPrice += addons[addons.length-1].totalPrice;
			quote.totalPrice =+ quote.counters[index].totalPrice;
		} else {
			//Found it, so update the value
			addons[arraySearch(product, addons)].quantity = quantity;
			addons[arraySearch(product, addons)].totalPrice = totalPrice;
			quote.counters[index].totalPrice += addons[arraySearch(product, addons)].totalPrice;
		};

		$scope.dropDown1 = "";
		$scope.dropDown2 = "";
		$scope.addonQuantity = "";

		quote.totalPrice += addons[arraySearch(product, addons)].totalPrice;
		$scope.quote = quote;
		//updatePrice(quantity, price, "addon"); - For use later
		
	};	
	
	$scope.removeAddon = function(addon, counterIndex, addonIndex, quote){		
		quote.totalPrice -= addon.totalPrice;
		quote.counters[counterIndex].totalPrice -= addon.totalPrice;
		quote.counters[counterIndex].addons.splice(addonIndex, addonIndex+1);
	};

	$scope.saveTable = function(quote, width, length, shape, materialColourGroup, materialColour, materialPrice, products) {
		var squareFootage = 0;
		var pushObj = {};
		var pushMandatory = {};
		var pushMandatoryDropDown = {};
		var sheets = 0;
		if($scope.shape == "circle"){
			length = 0;
		}
		console.log(width + "/" + length + "/" + shape + "/" + materialColourGroup + "/" + materialColour + "/" + materialPrice)
		console.log("width: " + width + "length: " + length);
		pushObj = {
			counterShape: shape,
			counterLength: length,
			counterWidth: width,
			totalPrice: 0,
			material:{
				colourGroup: materialColourGroup,
				colour: materialColour,
				price: materialPrice
			},
			addons: [],
			mandatoryCharges: []
		};
		console.log(products);
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
				}
				pushObj.mandatoryCharges.push(pushMandatory);
			}
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
		console.log(squareFootage);
		//update total price
		sheets = squareFootage / 22500;
		sheets = sheets.toFixed(0);
		if(sheets ==="0"){sheets=1};
		console.log("Sheets: " + sheets);

		quote.counters[quote.counters.length-1].totalPrice = sheets * materialPrice;
		quote.totalPrice = quote.totalPrice + quote.counters[quote.counters.length-1].totalPrice;
		$scope.quote = quote;
	};

	$scope.deleteTable = function(quote, index) {
		quote.totalPrice = quote.totalPrice - quote.counters[quote.counters.length-1].totalPrice;

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
		
		console.log(quote);
		$http.post('/savequote', {"quote":quote}).
  		success(function(data, status, headers, config) {
	    	// this callback will be called asynchronously
	    	// when the response is available
	    	$scope.addAlert("success", "Quote saved Successfully");
	  	}).
  		error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			$scope.addAlert("danger", "Error: Quote did not save");
  		});
	};
}]);