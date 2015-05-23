'use strict';
 
app.controller('quoteCtrl',
  ['$scope', '$state', '$http',  function ($scope, $state, $http) {
  	function updatePrice() {

  	};

	$scope.showCounter = function() {  
		$scope.addTable = true;
	};

	$scope.hideCounter = function() {  
		$scope.addTable = false;
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
	        }
	    }
	}

	$scope.saveAddon = function(quote, index, name, product, price, quantity) {
		var addons = quote.counters[index].addons;
		/*console.log(index);
		console.log(name);
		console.log(product);
		console.log(price);
		console.log(quantity);*/

		var pushObj = {};
		var result = $.grep(addons, function(e){ return e.product === product; });
				
		if (Object.keys(result).length === 0) {
			//Couldn't find it, so add a new value
			pushObj = {
				name: name,
				product: product,
				quantity: quantity,
				price: price
			};
			addons.push(pushObj);
		}
		else {
			//Found it, so update the value
			addons[arraySearch(product, addons)].quantity = quantity;
		}

		$scope.dropDown1 = "";
		$scope.dropDown2 = "";
		$scope.addonQuantity = "";
		$scope.quote = quote;
	};

	$scope.saveTable = function(quote, width, length, shape, materialColourGroup, materialColour, materialPrice) {
		if($scope.shape == "circle"){
			length = 0;
		}
		console.log(width + "/" + length + "/" + shape + "/" + materialColourGroup + "/" + materialColour + "/" + materialPrice)
		console.log("width: " + width + "length: " + length);
		var pushObj = {
			counterShape: shape,
			counterLength: length,
			counterWidth: width,
			materialColourGroup: materialColourGroup,
			materialColour: materialColour,
			materialPrice: materialPrice,
			addons: []
		};
		quote.counters.push(pushObj);
		$scope.hideCounter();

		console.log(quote.counters);

		//update total price
		updatePrice();
	};

	$scope.removeAddon = function(addon, index, quote){
		console.log(quote);
		quote.counters[index].addons.splice(index, index+1);
	};

	$scope.deleteTable = function(quote, index) {
		quote.counters.splice(index, index+1);
//I don't think I need a refresh		$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
	};

	$scope.saveQuote = function(quote, description) {
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