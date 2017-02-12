(function() {
	'use strict';
 
	angular.module('surfacingSolutions')
	.controller('quoteFinalCtrl', quoteFinalCtrl);

	quoteFinalCtrl.$inject = ['$scope', 'dataFactory', '$stateParams', '$http', '$window', '$mdDialog'];

	function quoteFinalCtrl($scope, dataFactory, $stateParams, $http, $window, $mdDialog) {
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

				console.log(vm.quote);
				//get totalprice for each group to add at "total"
				var total = 0;
				for (var i = vm.quote.counterGroup.length - 1; i >= 0; i--) {
					total += vm.quote.counterGroup[i].totalPrice;
				};
				vm.getCountersTotal = total;
			},
			function(reason) {
				console.log(reason);
			});	

		/*vm.getCountersTotal = function() {
			console.log(vm.quote);
			var total = 0;
			for (var i = vm.quote.counterGroup.length - 1; i >= 0; i--) {
				total += vm.quote.counters[i].totalPrice;
			};
			return total;
		};*/

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

		vm.email = function(ev) {
			// Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
		          .title('Send Email')
		          .textContent('Would you like to send the email to ' + vm.customer.firstName + " " + vm.customer.lastName + " @ " + vm.customer.email)
		          //.placeholder('Enter an Email')
		          .ariaLabel('Send Email')
		          //.initialValue(vm.customer.email)
				  .targetEvent(ev)
		          .ok('Send Quote')
		          .cancel('Cancel');


		    $mdDialog.show(confirm).then(function(result) {
		      	console.log("User chose send");
				vm.render(vm.quote, vm.customer.firstName, vm.customer.lastName, vm.customer.email);
		    }, function() {
		      console.log("User Cancelled.");
			});
		};

		vm.render = function(quote, firstName, lastName, email) {
			var data = {
				url: '/#/customer/' + custCode + '/quotebuild/' + quoteID + '/quotesend',
				userID : custCode,
				quoteID : quoteID,
				email : email,
				description : quote.description,
				customer : {
					firstName : firstName,
					lastName : lastName
				},
				createdAt : quote.createdAt.substring(0, 10),
				account : quote.account,
				//These are placeholders right now
				salesPerson : {
					firstName : "Peter",
					lastName : "Smith",
					email : "pete@surfacingsolutions.ca",
					phoneNumber : "(905)-874-1814"
				}
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
		
		//calendar picker
		vm.today = function() {
		vm.dt = new Date();
		};
		vm.today();

		vm.clear = function() {
		vm.dt = null;
		};

		vm.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
		};

		vm.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
		};

		// Disable weekend selection
		function disabled(data) {
		var date = data.date,
		  mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		}

		vm.toggleMin = function() {
		vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
		vm.dateOptions.minDate = vm.inlineOptions.minDate;
		};

		vm.toggleMin();

		vm.open1 = function() {
		vm.popup1.opened = true;
		};

		vm.open2 = function() {
		vm.popup2.opened = true;
		};

		vm.setDate = function(year, month, day) {
		vm.dt = new Date(year, month, day);
		};

		vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		vm.format = vm.formats[0];
		vm.altInputFormats = ['M!/d!/yyyy'];

		vm.popup1 = {
		opened: false
		};

		vm.popup2 = {
		opened: false
		};

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 1);
		vm.events = [
		{
		  date: tomorrow,
		  status: 'full'
		},
		{
		  date: afterTomorrow,
		  status: 'partially'
		}
		];

		function getDayClass(data) {
		var date = data.date,
		  mode = data.mode;
		if (mode === 'day') {
		  var dayToCheck = new Date(date).setHours(0,0,0,0);

		  for (var i = 0; i < vm.events.length; i++) {
		    var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

		    if (dayToCheck === currentDay) {
		      return vm.events[i].status;
		    }
		  }
		} 	
		return '';
		};
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
	        };
    	});
    	return flatten;
    };
  });
	//This function is no longer used?
	angular.module('surfacingSolutions')
	.filter('termDate', function() {
    return function(term, quote) {
    	var date = " " + quote.createdAt.substring(0, 10);
    	if(term == "This quotation is based on the measurements and specifications provided on "){
      		term += date;
		};
      	return term;
    };
  });
}());