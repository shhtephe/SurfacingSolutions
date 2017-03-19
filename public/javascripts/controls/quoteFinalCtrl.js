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
				//build email body
				vm.init();

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

		vm.init = function() {
			vm.selectedContacts	= [];
			vm.buildEmailBody();
		};

		vm.buildEmailBody = function() {
			if(typeof vm.customer.contacts[0] === 'undefined') {
				vm.emailBody = 
				vm.customer.firstName + ", please find attached our quote for services based on the information you provided. " +
				"If you have any questions please call our office and speak to your sales person.<br><br>Thank you for the opportunity " +
				"and we look forward to working with you.<br><br>" + vm.quote.account.firstName + " " + vm.quote.account.lastName + 
				"<br> Surfacing Solutions (2010) Limited<br>e: " + vm.quote.account.email + " t: " + vm.quote.account.phoneNumber;	
			} else if(vm.selectedContacts.length == 1) {
				vm.emailBody = 
				vm.selectedContacts[0].firstName + ", please find attached our quote for services based on the information you provided. " +
				"If you have any questions please call our office and speak to your sales person.<br><br>Thank you for the opportunity " +
				"and we look forward to working with you.<br><br>" + vm.quote.account.firstName + " " + vm.quote.account.lastName + 
				"<br> Surfacing Solutions (2010) Limited<br>e: " + vm.quote.account.email + " t: " + vm.quote.account.phoneNumber;
			} else {
				vm.emailBody = 
				"Please find attached our quote for services based on the information you provided. " +
				"If you have any questions please call our office and speak to your sales person.<br><br>Thank you for the opportunity " +
				"and we look forward to working with you.<br><br>" + vm.quote.account.firstName + " " + vm.quote.account.lastName + 
				"<br> Surfacing Solutions (2010) Limited<br>e: " + vm.quote.account.email + " t: " + vm.quote.account.phoneNumber;
			};
			
		};

		vm.buildContacts = function() {
			vm.selectedContacts = [];
			vm.contactEmailList = [];
			for (var i = vm.customer.contacts.length - 1; i >= 0; i--) {
				if(vm.customer.contacts[i].sendEmail == true) {
					vm.selectedContacts.push(vm.customer.contacts[i]);
					vm.contactEmailList.push(vm.customer.contacts[i].email);
				};
			};
			vm.buildEmailBody();
		};

		//save the quote
		vm.saveQuote = function() {
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

		vm.email = function(ev, contactEmailList) {
			// Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
		          .title('Send Email')
		          .textContent('Would you like to send the email to ' + contactEmailList +"?")
		          //.placeholder('Enter an Email')
		          .ariaLabel('Send Email')
		          //.initialValue(vm.customer.email)
				  .targetEvent(ev)
		          .ok('Send Quote')
		          .cancel('Cancel');


		    $mdDialog.show(confirm).then(function(result) {
		      	console.log("User chose send");
				vm.render(vm.quote, contactEmailList);
		    }, function() {
		      console.log("User Cancelled.");
			});
		};

		vm.render = function(quote, email) {
			if(typeof email =='undefined'){
				vm.addAlert("warning", "No contacts have been selected.");
			} else {
				var data = {
					url : '/#/customer/' + custCode + '/quotebuild/' + quoteID + '/quotesend',
					userID : custCode,
					quoteID : quoteID,
					email : email,
					emailBody : vm.emailBody,
					description : quote.description,
					createdAt : quote.createdAt.substring(0, 10),
					account : quote.account
				};
				console.log(data.account)

				//Need to declare that it's sending a json doc
				$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
				$http.post('/emailrender', {"data":data}).
		  		success(function(data, status, headers, config) {
			    	// this callback will be called asynchronously
			    	// when the response is available
			    	vm.addAlert("success", "Page rendered and emailed successfully.");
			    	console.log("Success!");
			  	}).
		  		error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					vm.addAlert("danger", "Error: Page not rendered.");
		  			console.log("Failure!");
		  		});
			};
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