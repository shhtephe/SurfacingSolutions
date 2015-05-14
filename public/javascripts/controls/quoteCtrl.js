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
	};

	$scope.alerts = [
  	];

  	$scope.addAlert = function(type, msg) {
	    $scope.alerts.push({
	    	type: type,
	    	msg: msg
	    });
  	};

  	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
  	};

	$scope.saveTable = function(quote, width, length, shape) {
		console.log("width: " + width + "length: " + length);
		var pushObj = {
			counterShape: shape,
			counterLength: length,
			counterWidth: width,
			addons: [{

			}]
		};
	quote.counters.push(pushObj);
	$scope.addTable = false;

	//update total price
	updatePrice();
	};

	$scope.saveAddon = function(quote, index, name, product, quantity) {
		console.log(product);
		console.log(quote.counters[index]);
		var pushObj = {addons: {}};
		if(typeof quote.counters[index].addons === 'undefined'){
			quote.counters[index].push(pushobj)
			/*
				name: name,
				product: product,
				quantity: quantity,
				price: price
			};*/
			console.log("It's undefined, obviously");
			//quote.counters[index].addons.push(pushObj);
		} else {
			//quote.counters[index].addons[product].splice(index, index+1);
			//quote.counters[index].addons[product].pop()
		}
		/*.quantity = {
			quantity
		}*/

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
	}
}]);