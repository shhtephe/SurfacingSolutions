(function() {
	'use strict';
 
	angular.module('surfacingSolutions')
	.controller('quoteFinalCtrl', quoteFinalCtrl);

	quoteFinalCtrl.$inject = ['dataFactory', '$stateParams', '$http', '$window'];

	function quoteFinalCtrl(dataFactory, $stateParams, $http, $window) {
		console.log($window.status);
		var vm = this;
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

		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;

		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.customer = data.customer;
				vm.products = data.products;
				vm.materials = data.materials;
			},
			function(reason) {
				console.log(reason);
			});	

		vm.email = function() {
			vm.render();

		};

		vm.render = function() {
			var data = {
				url: '/#/customer/' + custCode + '/quote/' + quoteID + '/quotefinal',
				userID : custCode,
				quoteID : quoteID
			};

			//Need to declare that it's sending a json doc
			$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
			$http.post('/emailrender', {"data":data}).
	  		success(function(data, status, headers, config) {
		    	// this callback will be called asynchronously
		    	// when the response is available
		    	vm.addAlert("success", "Page Rendered successfully.");
		    	console.log("Success!");
		  	}).
	  		error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				vm.addAlert("danger", "Error: Page not rendered.");
	  			console.log("Failure!");
	  		});
		};

		$window.status = "ready";	
	};
	angular.module('surfacingSolutions')
	.filter('flattenRows', function() {
    return function(counters) {
      var flatten = [];
      angular.forEach(counters, function(counter) {
        var addons = counter.addons;
        flatten.push(counter);
        if (addons) {
          angular.forEach(addons, function(addon) {
            flatten.push(angular.extend(addon, {addon: true}));
          });
        }
      });
      return flatten;
    }
  });
}());