'use strict';
 
app.controller('quoteCtrl',
  ['$scope', '$state', '$http',  function ($scope, $state, $http) {
	$scope.showCounter = function() {  
		$scope.addTable = true;
	};

	$scope.hideCounter = function() {  
		$scope.addTable = false;
	};

	$scope.saveTable = function(quote, width, length, shape) {
		console.log("width: " + width + "length: " + length);
		var pushObj = {
			counterShape: shape,
			counterLength: length,
			counterWidth: width,
			addons: {
				highGlossFinish: {
					quantity: 0
				},
				cuttingBoards: {
					quantity: 0
				},
				backBridgeForSlideInStove: {
					quantity: 0
				},
				drainBoard: {
					quantity: 0
				},
				directionalMaterialFabrication: {
					quantity: 0
				},
				adhesivePerLinerFoot: {
					quantity: 0
				},
				siteJoint: {
					quantity: 0
				}
			}
		};
		var addonsPushObj = {

		}
		quote.counters.push(pushObj);
		$scope.addTable = false;
	}

	$scope.saveAddon = function(quote, index, product, quantity) {
		console.log(product);
		console.log(quote.counters[index].addons);

		quote.counters[index].addons[product].quantity = quantity

		$scope.dropDown1 = 0;
		$scope.dropDown2 = 0;
		$scope.addonQuantity = "";
	}
	$scope.removeAddon = function(addon, index, quote){
		console.log(quote);
		quote.counters[index].addons[addon].quantity=0;
	}

	$scope.deleteTable = function(quote, index) {
		quote.counters.splice(index, index+1);

//I don't think I need a refresh		$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
	}

	$scope.saveQuote = function(quote) {
		//save the quote
		console.log(quote);
		$http.post('/savequote', {"quote":quote}).
  		success(function(data, status, headers, config) {
    	// this callback will be called asynchronously
    	// when the response is available
    	$scope.msg = "Quote Saved!";
	  	}).
  		error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
		$scope.msg = "Error: Quote did not save.";
  		});
	}
}]);