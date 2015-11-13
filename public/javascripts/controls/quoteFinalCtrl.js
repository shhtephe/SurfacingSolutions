(function() {
	'use strict';

	angular
		.module('surfacingSolutions')
		.controller('quoteFinalCtrl', quoteFinalCtrl);

	quoteFinalCtrl.$inject = ['dataFactory', '$stateParams'];

	function quoteFinalCtrl (dataFactory, $stateParams) {
		var vm = this;
		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;

		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.customer = data.customer;
			},
			function(reason) {
				console.log(reason);
			});

		vm.email = function() {
			vm.render();
			
		};

		vm.render = function() {
			var done = false; //flag that tells us if we're done rendering

			var page = require('webpage').create();
			page.open('http://google.com', function (status) {
			    //If the page loaded successfully...
			    if(status === "success") {
			        //Render the page
			        page.render('google.png');
			        console.log("Site rendered...");

			        //Set the flag to true
			        done = true;
			    }
			});

			//Start polling every 100ms to see if we are done
			var intervalId = setInterval(function() {
			    if(done) {
			        //If we are done, let's say so and exit.
			        console.log("Done.");
			        phantom.exit();
			    } else {
			        //If we're not done we're just going to say that we're polling
			        console.log("Polling...");
			    }
			}, 100);
		};
	};
}());