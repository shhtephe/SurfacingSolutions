(function() {
	'use strict';
 
	angular.module('surfacingSolutions')
	.controller('quoteCtrl', quoteCtrl);

	quoteCtrl.$inject = ['dataFactory', '$stateParams', '$location', '$http', '$scope', '$uibModal'];

	function quoteCtrl(dataFactory, $stateParams, $location, $http, $scope, $uibModal) {
		//'this' replaces $scope
		var vm = this;
		//Used on quotebuild.hbs
		vm.math = Math;

		/*THIS IS THE TEMPORARY CONST DECLARATIONS*/
		var 
		LCPSF = 11.75,
		CCPSF = 5.25,
		TGM = 35;


		var custCode = $stateParams.custCode;
		var quoteID = $stateParams.quoteID;

		dataFactory.getQuote(custCode, quoteID)
			.then(function(data) {
				vm.quote = data.quote;
				vm.terms = data.terms;
				vm.customer = data.customer;
				vm.products = data.products;
				vm.materials = data.materials;
				vm.terms = data.terms;
			},
			function(reason) {
				console.log(reason);
			});		
		//get customers for copy quote modal
		dataFactory.getCustomers()
			.then(function(data) {
				vm.customers = data;
			},
			function(reason) {
				console.log(reason);
			});

		//***************************
		//baby's first modal
		vm.addCounter = function (groupNumber, counters) {
			//console.log(groupNumber, counters);
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'addcounter.html',
		      controller: ['$uibModalInstance', 'groupNumber', 'counters', addCounterCtrl],
		      controllerAs: 'vm',
		      windowClass: 'counter-add-modal',
		      resolve: {
		        groupNumber: function() {return groupNumber},
		        counters: function() {return counters}
		        }
      	  	});

      	  	modalInstance.result.then(function (counter) {
      			//Save the countertop and put all the data back onto the main controller
      			console.log(counter.groupNumber);
      			vm.calcCounter(parseFloat(counter.width), parseFloat(counter.length), counter.shape, counter.counters, counter.groupNumber, counter.description, true);  			 				
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var addCounterCtrl = function($uibModalInstance, groupNumber, counters) {
	    	var vm = this;

	    	vm.groupNumber = groupNumber;
	    	vm.counters = counters;

			vm.checkIsNumber = function(width, length, shape) {
				width = parseFloat(width);
				length = parseFloat(length);
				if(shape === "circle") {
					width = length;
				};
				//console.log(parseFloat(width), isFinite(parseFloat(width)), typeof parseFloat(width), length);
				console.log(parseFloat(width), isFinite(width), width);
				if(isFinite(width) && isFinite(length)){
					console.log(true)
					return true
				};
				
			};

	    	vm.saveCounterModal = function(width, length, shape, description, counters, groupNumber) {
	    		console.log(counters, groupNumber);
	    		width = parseFloat(width);
	    		length = parseFloat(length);
	    		var counter = {
	    			width: width,
	    			length: length, 
	    			shape: shape, 
	    			description: description,
	    			groupNumber: groupNumber,
	    			counters: counters
	    		};

	    		$uibModalInstance.close(counter);
	    	};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    };
		//***************************	

		//Visual render and print of countertop and materials
		vm.counterRenderModal = function (counterGroup) {
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'counterRenderModal.html',
		      controller: ['$uibModalInstance', 'counterGroup', counterRenderModalCtrl],
		      controllerAs: 'vm',
		      windowClass: 'counter-render-modal',
		      resolve: {
		        counterGroup: function() {return counterGroup}
		        }
      	  	});

      	  	modalInstance.result.then(function (counter) {
      	  		//Nothing happens when the modal is 'saved'
			}, function () {
				//close modal
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var counterRenderModalCtrl = function($uibModalInstance, counterGroup) {
	    	var vm = this;
	    	
	    	vm.counterGroup = counterGroup;
			//borrowed from http://jsfiddle.net/r4TMq/11/ and massaged

			vm.init = function () {
				console.log("Initialize");
		    	//This works like getElementByID
    			vm.canvas = document.getElementById('canvas');
		    	vm.context = vm.canvas.getContext('2d');

		    	// setup
			    vm.canvas.width = 850;
			    vm.canvas.height = 1100;
			    vm.canvasDisplay = 'slabs';
			    vm.context.fillStyle = "white";
				vm.context.fillRect(0, 0, canvas.width, canvas.height);
			    //context.globalAlpha = 1.0;
			    //context.beginPath(); 

			    for (var i = vm.counterGroup.counters.length - 1; i >= 0; i--) {
			    	vm.data.counters.push(vm.counterGroup.counters[i]);
			    };
			    drawSlab(vm.data.material, vm.context);
			    console.log(vm.data);
		    };

		    vm.showCounters = function() {
				vm.canvasDisplay = 'counters';
				vm.context.fillStyle = "white";
				vm.context.fillRect(0, 0, canvas.width, canvas.height);
				//print Counters
				drawCounters();
		    };

		    vm.showSlab = function() {
				vm.canvasDisplay = 'slabs';
				vm.context.fillStyle = "white";
				vm.context.fillRect(0, 0, canvas.width, canvas.height);
				//print slab
				drawSlab(vm.data.material, vm.context);
		    };

		    vm.printCanvas = function() {
		    	var img    = vm.canvas.toDataURL("image/png");
				//var printContents = document.getElementById("modal-body").innerHTML;
				var popupWin = window.open('', '_blank', 'width=300,height=300');
				popupWin.document.open();
				popupWin.document.write('<html><head> <link rel="stylesheet" type="text/css" href="stylesheets/quotestyle.css"/> <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"> <link rel="stylesheet" type="text/css" href="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.1/angular-material.css"/> </head> <body onload="window.print()"> <img src="' + img + '"/></body> </html>');
				popupWin.document.close();
			};

			vm.data = {
       			material: {
       				manufacturer: vm.counterGroup.material.manufacturer,
       				description: vm.counterGroup.material.description,
       				collection: vm.counterGroup.material.collection,
       				width: vm.counterGroup.material.width,
       				length: vm.counterGroup.material.length, 
       				thickness: vm.counterGroup.material.thickness,
       				sheets: vm.counterGroup.sheets
       			},
       			counters: []
    		};
		    
		    function drawSlab(slab, context) {
	    		console.log(slab, context.canvas.width);
	    		//resize relative to the canvas size

	    		var slabMultiplier = 850 / slab.length;
	    		var resizedWidth = slab.width * slabMultiplier;

		    	var startPositionX = 0;	
		    	//center the vertical start position
		    	var startPositionY = (context.canvas.height/2) - (0.5 * resizedWidth);


		    	console.log(slab, startPositionX, startPositionY, resizedWidth, slab.length);
		    	context.beginPath();
		        context.rect(startPositionX, startPositionY, 850, resizedWidth );
		        context.fillStyle = "#ffffff";
		        context.fill();
		        context.lineWidth = 1;
		        context.strokeStyle = "#000000";
		        context.stroke();  
		        drawSlabInfo(slab, context, startPositionX, startPositionY, resizedWidth);
		    }

		    function drawSlabInfo(slab, context, x, y, resizedWidth) {
		    	var info = "";
		    	if (slab.manufacturer) {
		    		info += slab.manufacturer;
		    	};
		    	if (slab.description) {
		    		info += " " + slab.description;	
		    	};
		    	if (slab.collection) {
		    		info += " - " + slab.collection;
		    	};

		    	console.log(x, y, resizedWidth)
		    	x += (context.canvas.width / 2) - 300;
		    	y += (resizedWidth / 2);
		    	
		    	context.beginPath();
		    	context.font = "28px Bodoni";
		        context.fillStyle = "#000000";
		    	context.fillText(info, x, y);

		    	//move y down one line
		    	y += 30;
		    	
		    	//load info for second line
		    	info = slab.width + '" X ' + slab.length + '" x ' + slab.thickness + '"';
		    	context.beginPath();
				context.fillText(info, x, y);
		    }

		    function drawCounters() {
		    	var startPositionX = 0;
		    	var startPositionY = 0;
		    	var tallestCounter = 0;
		    	var data = vm.data;
		    	var context = vm.context;
		    	var slabMultiplier = 850 / vm.data.material.length;
		    	console.log(slabMultiplier);

		        for(var i=0; i<data.counters.length; i++) {
		        	console.log(startPositionX, startPositionY, tallestCounter, data.counters[i]);

		        	if (data.counters[i].counterShape == "circle") {
		        		if(data.counters[i].counterLength * 2 * slabMultiplier > tallestCounter){
						    tallestCounter = data.counters[i].counterLength * 2 * slabMultiplier;
						};

						//need to revise this to overflow.
						console.log(startPositionX + (data.counters[i].counterLength * slabMultiplier) * 2);
			            if (startPositionX + (data.counters[i].counterLength * slabMultiplier) * 2 > 850) {
			    			console.log("pruned starting position")
			    			startPositionX = 5;
			    			startPositionY += tallestCounter + 5;
			    		};
		        	};

		        	if (data.counters[i].counterShape == "rectangle") {
		        		if ((data.counters[i].counterLength * slabMultiplier) > tallestCounter) {
		        			tallestCounter = data.counters[i].counterLength * slabMultiplier;
		        		};

		        		//need to revise this to overflow.
			            if (startPositionX + (data.counters[i].counterWidth * slabMultiplier) > 850) {
			    			console.log("pruned starting position")
			    			startPositionX = 5;
			    			startPositionY += tallestCounter + 5;
			    		};
		        	};
	
		        	
		            if (data.counters[i].counterShape == 'rectangle') {
		            	drawRectangleCounter(data.counters[i], context, startPositionX, startPositionY, slabMultiplier);	
   			    		startPositionX += (data.counters[i].counterWidth * slabMultiplier) + 5;
		            } else if (data.counters[i].counterShape == 'circle') {
		            	drawCircleCounter(data.counters[i], context, startPositionX, startPositionY, slabMultiplier);
	          			startPositionX += (data.counters[i].counterWidth * 2 * slabMultiplier) + 5;
		            };
		        };
		    };

		    function drawRectangleCounter(counter, context, startPositionX, startPositionY, slabMultiplier) {
		    	console.log(counter, startPositionY, startPositionX);
		    	context.beginPath();
		        context.rect(startPositionX, startPositionY, counter.counterWidth * slabMultiplier, counter.counterLength * slabMultiplier);
		        context.fillStyle = "#ffffff";
		        context.fill();
		        context.lineWidth = 1;
		        context.strokeStyle = "#666666";
		        context.stroke();

		        drawRectangleInfo(startPositionX, startPositionY, counter, slabMultiplier, context);
		    };

		    function drawRectangleInfo(startPositionX, startPositionY, counter, slabMultiplier, context) {
		    	var info = "";
		    	if (counter.description) {
		    		info += counter.description;
		    	};

		    	console.log(startPositionX, startPositionY, counter.counterWidth, info, counter)
		    	startPositionY += (counter.counterLength * slabMultiplier / 2) - 30;
		    	startPositionX += 30;
		    	context.beginPath();
		    	//context.rotate(Math.PI/2);
		    	context.font = "16px Bodoni";
		        context.fillStyle = "#000000";

		    	context.fillText(info, startPositionX, startPositionY);

		    	info = counter.counterLength + '" X ' + counter.counterWidth + '"';
		    	startPositionY += 30;
		    	context.fillText(info, startPositionX, startPositionY);
		    };

		    function drawCircleCounter(counter, context, startPositionX, startPositionY, slabMultiplier) {
		    	console.log("Drawing Circle");
				
				startPositionX += counter.counterWidth * slabMultiplier;
		    	startPositionY += counter.counterWidth * slabMultiplier;
		    	console.log("Starting positions: ", startPositionX, startPositionY);
		    	context.beginPath();
		        context.arc(startPositionX, startPositionY, counter.counterWidth * slabMultiplier, 0, 2*Math.PI, false);
		        context.fillStyle = "#ffffff";
		        context.fill();
		        context.lineWidth = 1;
		        context.strokeStyle = "#666666";
		        context.stroke();
		        drawCircleInfo(startPositionX, startPositionY, counter, slabMultiplier, context);
		    };

		    function drawCircleInfo(startPositionX, startPositionY, counter, slabMultiplier, context) {
		    	var info = "";
		    	if (counter.description) {
		    		info += counter.description;
		    	};

		    	console.log(startPositionX, startPositionY, counter.counterWidth, info, counter)
		    	startPositionY -= 30;
		    	startPositionX -= 30;
		    	
		    	context.beginPath();
		    	context.font = "16px Bodoni";
		        context.fillStyle = "#000000";

		    	context.fillText(info, startPositionX, startPositionY);

		    	info = counter.counterLength + '" X ' + counter.counterWidth + '"';
		    	startPositionY += 30;
		    	context.fillText(info, startPositionX, startPositionY);
		    };
		    
	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};

	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
    	};

		//***************************
		//Copy Quote Modal
		vm.copyQuote = function (quote, currentUser, customers) {
			var contactSelect = "";
	    	var modalInstance = $uibModal.open({
		      animation: true,
		      templateUrl: 'copyQuote.html', 
		      controller: ['$uibModalInstance', 'quote', 'currentUser', 'customers', copyQuoteCtrl], //This puts the variables into the modal controller
		      controllerAs: 'vm',
		      windowClass: 'copy-quote-modal',
		      resolve: { //This injects the below variables into the modal
		      	customers: function() {return customers},
		        contactSelect: function() {return contactSelect},
		        quote: function() {return quote},
		        currentUser: function() {return currentUser}
		        }
      	  	});

      	  	modalInstance.result.then(function (contactSelect) {
      			//Save the countertop and put all the data back onto the main controller
      			console.log(contactSelect);
			}, function () {
      		console.log('Modal dismissed at: ' + new Date());
    		});
	    };

	    var copyQuoteCtrl = function($uibModalInstance, quote, currentUser, customers) {
	    	var vm = this;
	    	//console.log(quote, currentUser, customers)
	    	vm.quote = quote;
	    	vm.currentUser = currentUser;
	    	vm.customers = customers;

	    	vm.copyQuoteSave = function(contactSelect) {
	    		//console.log(vm.quote, vm.currentUser, contactSelect);
				//send copy HTTP call and navigate to that new quote page.
				$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
				$http.post('/newquote', {"quote":vm.quote, "currentUser":vm.currentUser, "customer":contactSelect, "copyQuote":"True"}).
		  		success(function(data, status, headers, config) {
			    	// this callback will be called asynchronously
			    	// when the response is available
			    	console.log(data);
			    	//redirect to the new page when created
			    	//Example path: #/customer/100140/quotebuild/132
			    	var path = "/customer/" + data.custCode + "/quotebuild/" + data.quoteID
			    	$location.path(path);

			  	}).
		  		error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					//vm.addAlert("danger", "Error: Quote did not get copied");
		  		});
	    		$uibModalInstance.close(contactSelect);
	    	};
	    	vm.cancel = function() {
				$uibModalInstance.dismiss('cancel');
	    	};
	    };
	    //*******************************

		//Stops user from leaving page and reminds them to save.
	    $scope.$on('$stateChangeStart', function( event ) {
    	var answer = confirm("Please ensure you have saved before leaving this page.")
	    	if (!answer) {
	        	event.preventDefault();
	    	};
		});

		//assign checkboxes for Terms of Service
		vm.checkTerms = function (term){
			var terms = vm.quote.terms;
			if (typeof vm.arraySearch(term.term, terms, "term") !== "undefined") {
				//Found the term, so check the box
				return true;
			} else {
				return false;
			};
		};
		

		//nameKey = string to find | myArray = the array | property = which property to find it in)
		vm.arraySearch = function (nameKey, myArray, property){
		    //console.log(nameKey, myArray, property);
		    for (var i=0; i < myArray.length; i++) {
		    	//console.log("my array i", myArray[i], "property", property)
		        if (myArray[i][property] === nameKey) {
		            //console.log("Found... returning: ", i);
		            return i;
		        };
		    };
		    //console.log("Did not find " + nameKey + " in property '" + property +"' in array.", myArray);
		};

		vm.buildTerms = function(term){
			var terms = vm.quote.terms;
			var pushObj = {};
			console.log("Calendar", term.calendar);
			//If there are no terms, create terms array
			if (typeof terms === "undefined") {
				terms = [];
			};
			//Search array for the term
			if (typeof vm.arraySearch(term.term, terms, "term") !== "undefined") {
				//Found it, so remove it from the terms
				terms.splice(vm.arraySearch(term.term, terms, "term"), 1);
			} else {
				//Couldn't find it, so add it to the terms
				console.log(term);
				pushObj = {
					term: term.term,
					calendar: term.calendar
				};
				terms.push(pushObj);
			};
			vm.quote.terms = terms;
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

		vm.addGroup = function() {
			//Create pushObj Array
			var pushObj = {};

			//check to see if first group
			if(typeof vm.quote.counterGroup[0] === "undefined") {
				pushObj = 
				{
					groupNumber: 0,
					TAC: 0,
					GMC: 0,
					GMCPSF: 0,
					GCPSF: 0,
					counters: [],
					addons:[],
					totalPrice: 0,
					quantity: 1,
					LSUM: 0,
					linearFootage: 0
				};
			} else {
				pushObj = {
					groupNumber : vm.quote.counterGroup.length,
					TAC: 0,
					GMC: 0,
					GMCPSF: 0,
					GCPSF: 0,
					counters: [],
					addons: [],
					totalPrice: 0,
					quantity: 1,
					LSUM: 0,
					linearFootage: 0					
				};
			};
			//Set total TAC if it hasn't been yet.
			if(typeof vm.quote.TAC == 'undefined'){
				vm.quote.TAC = 0;
			};
			vm.quote.counterGroup.push(pushObj);
		};

		vm.changePricing = function(pricing, groupNumber, material) {

			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//Set variables for ease of use ;)
			var sheets = vm.quote.counterGroup[groupIndex].sheets;
			var counterPrice = 0;
			var group = vm.quote.counterGroup[groupIndex];
			var addonsTotalPrice = 0;
			//Chooses based on which pricing model you choose how much to charge
	  		if(pricing == "halfSheet"){
				counterPrice = sheets * material.halfSheet;		
				vm.quote.counterGroup[groupIndex].material.pricing = "halfSheet";
			} else if(pricing =="fullSheet1"){
				counterPrice = sheets * material.fullSheet1;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet1";
			} else if(pricing == "fullSheet5"){
				counterPrice = sheets * material.fullSheet5;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet5";
			} else if(pricing == "fullSheet21") {
				counterPrice = sheets * material.fullSheet21;
				vm.quote.counterGroup[groupIndex].material.pricing = "fullSheet21";
			} else if(pricing == "isa") {
				counterPrice = sheets * material.isa;
				vm.quote.counterGroup[groupIndex].material.pricing = "isa";
			} else if(pricing == "sale") {
				counterPrice = sheets * material.sale;
				vm.quote.counterGroup[groupIndex].material.pricing = "sale";
			} else if(pricing == "quarterSheet") {
				counterPrice = sheets * material.quarterSheet;
				vm.quote.counterGroup[groupIndex].material.pricing = "quarterSheet";
			} else if(pricing == "custom") {
				console.log(material.customPrice);
				counterPrice = sheets * material.customPrice;
				vm.quote.counterGroup[groupIndex].material.pricing = "customPrice";
			};
						
			if(vm.quote.counterGroup[groupIndex].material) {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material, pricing);
			};
	  	};

		vm.removeGroup = function(index) {
			console.log(index, vm.quote.counterGroup[index])
			var groupIndex = vm.arraySearch(index, vm.quote.counterGroup, 'groupNumber');
			//subtract the group total from quote total
			console.log(vm.quote, vm.quote.counterGroup[groupIndex], groupIndex)
			vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].totalPrice;
			//Subtract LSUM and LW from quote
			vm.quote.linearFootage -= vm.quote.counterGroup[groupIndex].linearFootage;
			vm.quote.linearLSUM -= vm.quote.counterGroup[groupIndex].linearLSUM;
			//Subtract TAC from quote
			vm.quote.TAC -= vm.quote.counterGroup[groupIndex].TAC;
			//Update Mandatory addons with new TAC
			vm.updateMandatoryAddons(groupIndex, vm.quote.TAC);
			//Remove from Array
			vm.quote.counterGroup.splice(groupIndex, 1);
		};

		vm.calcSquareAndYield = function(shape, pushObj, length, width){
			//Calculates square footage and areaYield.
			if(shape === "rectangle"){
				pushObj.squareFootage = (length * width)/144; //measurements are in inches, then converted to feet
				pushObj.areaYield = pushObj.squareFootage;
			} else if(shape === "circle"){
				pushObj.squareFootage = (Math.PI * (Math.pow(width, 2)))/144;
				pushObj.areaYield = ((width * 2) * (width * 2))/144;
			};
			//Truncate the squareFootage to 2 decimals
			pushObj.squareFootage = parseFloat(pushObj.squareFootage.toFixed(2));
			pushObj.areaYield = parseFloat(pushObj.areaYield.toFixed(2));

			return pushObj;
		};

	  	//This is called from the add counter modal. Passes the values from the modal to the main page.
		vm.calcCounter = function(width, length, shape, counterIndex, groupIndex, description, modal) {
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
		  	//var groupIndex = vm.arraySearch(groupIndex, vm.quote.counterGroup, 'groupNumber');
		  	console.log("Group Index", groupIndex, "vm.quote.counterGroup", vm.quote.counterGroup, "counter index", counterIndex);

		//Obviously, we set some variables. 
			var squareFootage = 0;
			var pushObj = {};
			var pricing = "";
			var areaYield = 0;

			//Saves me from worrying about which dimension to multiply
			if(shape === "circle"){
				length = width;
			};

			//For whatever reason, they're sometimes text :( This might be fixed - TO DELETE?
			/*width = parseFloat(width);
			length = parseFloat(length);*/

			//Create an object containing all core counter information
			pushObj = {
				description: description,
				counterShape: shape,
				counterLength: length,
				counterWidth: width,
				squareFootage: 0,
				linearFootage: 0,
				areaYield: 0,
				LSUM: 0
			};
			
			pushObj = vm.calcSquareAndYield(shape, pushObj, length, width);

			console.log(pushObj);

			//Zeroes out LSUM if it isn't set
			if(typeof vm.quote.LSUM == "undefined"){
				vm.quote.LSUM = 0;
			};
			//Calc LSUM for counter to be used for calculations for addons
			if(shape === "rectangle") {
				pushObj.LSUM = (length) / 12;
				pushObj.LSUM = Math.round((pushObj.LSUM + 0.00001) * 100) / 100;
			} else {
				pushObj.LSUM = ((2 * Math.PI) * (length /2)) / 12;
				pushObj.LSUM = Math.round((pushObj.LSUM + 0.00001) * 100) / 100;
			};
			vm.quote.LSUM += pushObj.LSUM;
			if(shape === "rectangle") {
				pushObj.linearFootage = ((length) + (width)) / 12;
				pushObj.linearFootage = Math.round((pushObj.linearFootage + 0.00001) * 100) / 100;
			} else {
				pushObj.linearFootage = ((2 * Math.PI) * (length /2)) / 12;
				pushObj.linearFootage = Math.round((pushObj.linearFootage + 0.00001) * 100) / 100;
			};
			//If no value has been put here, 0 it.
			if(typeof vm.quote.linearFootage == "undefined"){
				vm.quote.linearFootage = 0;
			};
			//"Save" the counter to vm.quote
			vm.commitCounter(modal, pushObj, counterIndex, groupIndex);
			//Update the addon quantities for the group and mandatory addon quantities and recalculate them 
			vm.updateGroupAddons(groupIndex, shape, vm.quote.counterGroup[groupIndex].TAC);
			//Do the same as above for mandatory addons
			vm.updateMandatoryAddons(groupIndex, vm.quote.TAC);
			//recalculate group if material is present
			if(typeof vm.quote.counterGroup[groupIndex].material !== 'undefined') {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
			};
		};

		vm.commitCounter = function(modal, pushObj, counterIndex, groupNumber){
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
			console.log(groupNumber, vm.quote.counterGroup);
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			//Commits data to arrays depending on whether it's an edit or a new save.
			console.log("Group Index", groupIndex, "Group Contents", vm.quote.counterGroup[groupIndex]);
			console.log(typeof vm.quote.counterGroup[groupIndex].counters[counterIndex] === "undefined", vm.quote.counterGroup[groupIndex].counters[counterIndex]);
			if(typeof vm.quote.counterGroup[groupIndex].counters[counterIndex] === "undefined"){
				//push counter into vm.quote
				vm.quote.counterGroup[groupIndex].counters.push(pushObj);	
			} else{
				vm.quote.counterGroup[groupIndex].counters[counterIndex] = pushObj;

				if(typeof vm.quote.counterGroup[groupIndex].material !== 'undefined') {
					vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
				};
			};
			//Add up all the LSUM, linearFootage and squareFootage values for all counters in the group
			vm.quote.counterGroup[groupIndex].LSUM = 0;
			vm.quote.counterGroup[groupIndex].linearFootage = 0;
			vm.quote.counterGroup[groupIndex].squareFootage = 0;
			vm.quote.counterGroup[groupIndex].areaYield = 0;
			for (var i = vm.quote.counterGroup[groupIndex].counters.length - 1; i >= 0; i--) {
				vm.quote.counterGroup[groupIndex].LSUM += vm.quote.counterGroup[groupIndex].counters[i].LSUM;
				vm.quote.counterGroup[groupIndex].linearFootage += vm.quote.counterGroup[groupIndex].counters[i].linearFootage;
				vm.quote.counterGroup[groupIndex].squareFootage += vm.quote.counterGroup[groupIndex].counters[i].squareFootage;
			};
			vm.quote.counterGroup[groupIndex].LSUM = Math.round((vm.quote.counterGroup[groupIndex].LSUM + 0.00001) * 100) / 100;
			vm.quote.counterGroup[groupIndex].linearFootage = Math.round((vm.quote.counterGroup[groupIndex].linearFootage + 0.00001) * 100) / 100;
			vm.quote.counterGroup[groupIndex].squareFootage = Math.round((vm.quote.counterGroup[groupIndex].squareFootage + 0.00001) * 100) / 100;

			//Add up all the LSUM and linearFootage values for all groups in the quote
			vm.quote.LSUM = 0;
			vm.quote.linearFootage = 0;
			vm.quote.squareFootage = 0;

			for (var i = vm.quote.counterGroup.length - 1; i >= 0; i--) {
				vm.quote.LSUM += vm.quote.counterGroup[i].LSUM;
				vm.quote.linearFootage += vm.quote.counterGroup[i].linearFootage;
				vm.quote.squareFootage += vm.quote.counterGroup[i].squareFootage;
			};
			vm.quote.LSUM = Math.round((vm.quote.LSUM + 0.00001) * 100) / 100;
			vm.quote.linearFootage = Math.round((vm.quote.linearFootage + 0.00001) * 100) / 100;
			vm.quote.squareFootage = Math.round((vm.quote.squareFootage + 0.00001) * 100) / 100;

			//Add up all TAC and areaYield values for all counters in the group
			vm.quote.counterGroup[groupIndex].TAC = 0;
			for (var i = vm.quote.counterGroup[groupIndex].counters.length - 1; i >= 0; i--) {
				vm.quote.counterGroup[groupIndex].TAC += vm.quote.counterGroup[groupIndex].counters[i].squareFootage;
				if(typeof vm.quote.counterGroup[groupIndex].areaYield ==='undefined') {
					vm.quote.counterGroup[groupIndex].counters[i] = vm.calcSquareAndYield(vm.quote.counterGroup[groupIndex].counters[i].shape, vm.quote.counterGroup[groupIndex].counters[i], vm.quote.counterGroup[groupIndex].counters[i].length, vm.quote.counterGroup[groupIndex].counters[i].width);
				};
				vm.quote.counterGroup[groupIndex].areaYield += vm.quote.counterGroup[groupIndex].counters[i].areaYield;
			};
			vm.quote.counterGroup[groupIndex].TAC = Math.round((vm.quote.counterGroup[groupIndex].TAC + 0.00001) * 100) / 100;
			//Add up all TAC values for all groups in the quote
			vm.quote.TAC = 0;
			for (var i = vm.quote.counterGroup.length - 1; i >= 0; i--) {
				vm.quote.TAC +=  parseFloat(vm.quote.counterGroup[i].TAC.toFixed(2));
			};
			vm.quote.TAC = Math.round((vm.quote.TAC + 0.00001) * 100) / 100;
			//Because there's a new counter added, we need to update the "quantity" of each addon within the group
			for (var i = vm.quote.counterGroup[groupIndex].addons.length - 1; i >= 0; i--) {
				vm.saveAddon(vm.quote.counterGroup[groupIndex].addons[i], vm.quote.counterGroup[groupIndex].shape, vm.quote.counterGroup[groupIndex].TAC, groupIndex);
			};			
		};

		vm.removeCounter = function(groupNumber, index) {
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//Subtract counter totalPrice from group
			vm.quote.counterGroup[groupIndex].totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			//Subtract total price from quote
			vm.quote.totalPrice -= vm.quote.counterGroup[groupIndex].counters[index].totalPrice;
			//Subtract squareFootage from group
			vm.quote.counterGroup[groupIndex].TAC -= vm.quote.counterGroup[groupIndex].counters[index].squareFootage;
			//Subtract areaYield from group
			vm.quote.counterGroup[groupIndex].areaYield -= vm.quote.counterGroup[groupIndex].counters[index].areaYield;
			//Subtract squareFootage from quote
			vm.quote.TAC -= parseFloat(vm.quote.counterGroup[groupIndex].counters[index].squareFootage) * parseFloat(vm.quote.counterGroup[groupIndex].quantity);
			//subtract Linear Footage and LSUM from group and quote
			vm.quote.counterGroup[groupIndex].LSUM -= vm.quote.counterGroup[groupIndex].counters[index].LSUM;
			vm.quote.counterGroup[groupIndex].linearFootage -= vm.quote.counterGroup[groupIndex].counters[index].linearFootage;
			vm.quote.LSUM -= vm.quote.counterGroup[groupIndex].counters[index].LSUM
			vm.quote.linearFootage -= vm.quote.counterGroup[groupIndex].counters[index].linearFootage;
			//Remove the areaYield of a counter from the group
			vm.quote.counterGroup[groupIndex].areaYield -= vm.quote.counterGroup[groupIndex].counters[index].areaYield;
			//Remove from array
			vm.quote.counterGroup[groupIndex].counters.splice(index, 1);
			//recalculate group if material is present
			if(typeof vm.quote.counterGroup[groupIndex].material !== 'undefined') {
				vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
			};
		};

		//Any time the counter dimensions change, the addon "quantities" will change (SQFT and LINEAR LW/LSUM)
		vm.updateGroupAddons = function(index, shape, squareFootage){
			//for each addon in the group...
			for(var i = 0; i < vm.quote.counterGroup[index].addons.length; i++) {
				//Set the addon to a variable:
				var addon = vm.quote.counterGroup[index].addons[i];
				//Update "quantity" (linear, sqft) because of new counter dimensions
				vm.quote.counterGroup[index].addons[i].quantity = vm.updateAddon(addon, vm.quote.counterGroup[index].TAC, index, vm.quote.counterGroup[index].quantity);
				//calculate the total price value
				vm.quote.counterGroup[index].addons[i].totalPrice = vm.calcAddonTotal(addon, shape, squareFootage, index);
			};
		};

		vm.updateMandatoryAddons = function(index, squareFootage){
			//for each addon in the group...
			for(var i = 0; i < vm.quote.mandatoryAddons.length; i++) {
				//Set the addon to a variable:
				var addon = vm.quote.mandatoryAddons[i];
				//Update "quantity" (linear, sqft) because of new counter dimensions
				vm.quote.mandatoryAddons[i].quantity = vm.updateMandatoryAddon(addon, vm.quote.TAC, index);
				//calculate the total price value
				vm.quote.mandatoryAddons[i].totalPrice = vm.calcAddonTotal(addon, null, squareFootage, -1);
			};	
		};

		//updates the "quantity" value so it can be calculated - requires TAC for Sqft and total Length for linear
		vm.updateMandatoryAddon = function(addon, TAC, groupIndex) {
			console.log(TAC, addon.formula, vm.quote.linearFootage);
			//If formula is sqft or linear, the quantity is different This is to make the calculating easier, so it's just the quantity that's being handled, not TAC, width, length etc
			//Only if the value wasn't overriden
			if(!addon.overrideValue){
				if(addon.formula === "sqft"){
					if(typeof TAC == 'undefined') {
						TAC = 0; 
					};
					addon.quantity = TAC;
				} else if (addon.formula === "linearLW"){
					if(typeof vm.quote.linearFootage == 'undefined') {
						vm.quote.linearFootage = 0;
					};
					addon.quantity = vm.quote.linearFootage;
				} else if(addon.formula === "linearLSUM"){
					if(typeof vm.quote.linearLSUM == 'undefined') {
						vm.quote.linearLSUM = 0;
					};
					addon.quantity = vm.quote.linearLSUM;
				};
			} else {
				addon.quantity = addon.overrideValue;
			};
			console.log(addon.quantity);
			addon.quantity = parseFloat(addon.quantity);
			//Force as float and truncate to 2 decimal places
			addon.quantity = parseFloat(addon.quantity.toFixed(2));
			return addon.quantity;
		};

		//updates the "quantity" value so it can be calculated - requires TAC for Sqft and total Length for linear
		vm.updateAddon = function(addon, TAC, groupIndex, quantity) {
			console.log(vm.quote.counterGroup[groupIndex], addon.quantity, quantity, !addon.overrideValue);
			//if formula is sqft or linear(Lw/LSUM), the quantity is different This is to make the calculating easier, so it's just the quantity that's being handled, not TAC, width, length etc
			if (!addon.overrideValue) {
				if(addon.formula === "sqft"){
					addon.quantity = TAC * quantity;
				} else if (addon.formula === "linearLW"){
					addon.quantity = vm.quote.counterGroup[groupIndex].linearFootage * quantity;
				} else if (addon.formula === "linearLSUM"){
					addon.quantity = vm.quote.counterGroup[groupIndex].LSUM * quantity;
				};
			} else {
				addon.quantity = addon.overrideValue;
			};
			console.log(addon.quantity);
			addon.quantity = parseFloat(addon.quantity);
			addon.quantity = parseFloat(addon.quantity.toFixed(2));
			return addon.quantity;
		};

		vm.calcAddonTotal = function(addon, shape, squareFootage, index){
			//var counterLength = length;
			//var counterWidth = width;
			var totalPrice = 0;
			//temp until I find where it's being set as a string
			addon.quantity = parseFloat(addon.quantity);
			addon.price = parseFloat(addon.price);
			console.log(addon.quantity, addon.price, addon.formula, index);
			//calculation
			if (addon.formula === "item") {
				if(index == -1){
					totalPrice =  addon.quantity * addon.price;	
				} else {
					totalPrice =  addon.quantity * addon.price * vm.quote.counterGroup[index].quantity;	
				};
			}else if(addon.formula === "sqft"){
				//console.log(vm.quote.counterGroup[index]);
				totalPrice = addon.price * addon.quantity;
			}else if(addon.formula === "linearLW"){	
				totalPrice = addon.quantity * addon.price;
			}else if(addon.formula === "linearLSUM"){	
				totalPrice = addon.quantity * addon.price;
			}else{
				console.error("Unknown addon formula type!!!", addon.formula);
				totalPrice = addon.quantity * addon.price;
			};
			console.log(totalPrice);
			return(totalPrice.toFixed(2));
		};

		vm.saveAddon = function(addon, shape, TAC, groupIndex) {
			//console.log(typeof vm.quote.counterGroup[groupIndex].addons, addon, shape, length, width, groupIndex);
			console.log("SaveAddon ran: ",vm.quote.counterGroup[groupIndex], groupIndex, TAC, addon.quantity);

			if(typeof addon.quantity=== "undefined"){
				addon.quantity = 1;
			};

			//create addons array if it doesn't exist - for initilization | -1 means 'mandatory addon'
			if(groupIndex == -1){
				if(typeof vm.quote.mandatoryAddons === "undefined"){
					var addons = [];
				}else{
					var addons = vm.quote.mandatoryAddons;
				};
			} else {
				if(typeof vm.quote.counterGroup[groupIndex].addons === "undefined"){
					var addons = [];
				}else{
					var addons = vm.quote.counterGroup[groupIndex].addons;
				};
			};
			//Create the object to put into the array
			var pushObj = {};
			//Searches for the item by going through the list
			var search = vm.arraySearch(addon.description, addons, "description");
			//Update addons quantity values
			if(groupIndex == -1){
				addon.quantity = vm.updateMandatoryAddon(addon, TAC, groupIndex);
			} else {
				addon.quantity = vm.updateAddon(addon, TAC, groupIndex, vm.quote.counterGroup[groupIndex].quantity);
			};

			addon.quantity = parseFloat(addon.quantity);

			//Calculates the total price
			var totalPrice = parseFloat(vm.calcAddonTotal(addon, shape, TAC, groupIndex));
			console.log("Total Price", totalPrice);
			//If it can't find an existing addon to update, it makes a new one
			if (typeof search === "undefined") {
				//Couldn't find it, so add a new value
				pushObj = {
					distributor: addon.distributor,
					manufacturer: addon.manufacturer,
					productType: addon.productType,
					description: addon.description,
					itemCode: addon.itemCode,
					price: addon.price,
					formula: addon.formula,
					overrideValue: addon.overrideValue,
					quantity: addon.quantity,
					totalPrice: totalPrice
				};
				//depending on whether it's mandatory or not
				if(groupIndex == -1) {
					vm.quote.mandatoryAddons.push(pushObj);	
				} else {
					vm.quote.counterGroup[groupIndex].addons.push(pushObj);
				};				
			} else {
				//Found it, so update the value | depending on mandatory or not
				if(groupIndex == -1) {
					vm.quote.mandatoryAddons[search].quantity = addon.quantity;
					vm.quote.mandatoryAddons[search].totalPrice = totalPrice;
				} else {
					vm.quote.counterGroup[groupIndex].addons[search].quantity = addon.quantity;
					vm.quote.counterGroup[groupIndex].addons[search].totalPrice = totalPrice;
				};
			};

			//If it's not mandatory calculate the group it's in
			if(groupIndex != -1) {
				//recalculate group if material is present
				if(vm.quote.counterGroup[groupIndex].material) {
					vm.calcGroup(groupIndex, vm.quote.counterGroup[groupIndex].material);
				};
			} else {
				//Calculate just the mandatory stuff otherwise
				vm.calcMandatoryAddons();
			};
		};

		vm.removeAddon = function(addon, groupNumber, addonIndex){		
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var counterIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//if groupNumber is -1 it's a mandatory addon and comes from a different array.
			console.log(addon, groupNumber, addonIndex);
			if (groupNumber == -1) {
				vm.quote.mandatoryAddons.splice(addonIndex, 1);
			} else {
				vm.quote.counterGroup[counterIndex].addons.splice(addonIndex, 1);	
			};

			//recalculate group if material is present
			if(groupNumber !== -1) {
				vm.calcGroup(groupNumber, vm.quote.counterGroup[groupNumber].material);
			} else {
				vm.calcMandatoryAddons();
			};
		};

		vm.saveMaterial = function(material, groupNumber){
			console.log(material, groupNumber);
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//Add all the info for the material
			vm.quote.counterGroup[index].material = {
				itemCode: material.itemCode,
				thickness: material.thickness,
				width: material.width,
				length: material.length,
				overrideWidth: material.overrideWidth,
				overrideLength: material.overrideLength,
				halfSheet: material.halfSheet,
				fullSheet1: material.fullSheet1,
				fullSheet5: material.fullSheet5,
				fullSheet21: material.fullSheet21,
				isa: material.isa,
				distributor: material.distributor,
				manufacturer: material.manufacturer,
				colourGroup: material.colourGroup,
				description: material.description
			};
			//console.log(vm.quote.counterGroup[index].material);
			//Calculate the totals, since we have the material
			vm.calcGroup(index, material);
		};

		vm.editMaterialSave = function(material, groupNumber){
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		var index = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
	  		//Create pushObj
			var pushObj = {};

			//Create an object containing all core counter information, also leaving addons space
			pushObj = {
				itemCode: material.itemCode,
				thickness: material.thickness,
				width: material.width,
				length: material.length,
				overrideLength: material.overrideLength,
				overrideWidth: material.overrideWidth,
				price: material.price,
				fullSheet1: material.fullSheet1,
				halfSheet: material.halfSheet,
				fullSheet5: material.fullSheet5,
				fullSheet21: material.fullSheet21,
				isa: material.isa,
				distributor: material.distributor,
				manufacturer: material.manufacturer,
				colourGroup: material.colourGroup,
				description: material.description,
				addons: []
			};
			//replace the material with the pushObj
			vm.quote.counterGroup[index].material = pushObj;
			//If the material exists, calculate the totals
			if( vm.quote.counterGroup[index].material) {
				vm.calcGroup(index, material);
			};
		};
		
		vm.calcGroupSearchGroupIndex = function(groupNumber, material) {
			var groupIndex = vm.arraySearch(groupNumber, vm.quote.counterGroup, 'groupNumber');
			console.log(groupIndex);
			vm.calcGroup(groupIndex, material);
		};

		/*
		This function does the following:
		checks if "sheets" or quantity has a numberic value or will not run.
		
		*/
		vm.calcGroup = function(groupIndex, material, overridePricing){
			//Because of inverted group order, we have to search for the group in question, because I can't figure out a better/cooler way.
	  		console.log(groupIndex, vm.quote.counterGroup[groupIndex]);
			//If sheets entered is not a number or undefined, don't calculate.
			console.log("groupIndex", groupIndex, "Area Yield", vm.quote.counterGroup[groupIndex].areaYield, "groupIndex", groupIndex);
			if((isNaN(parseFloat(vm.quote.counterGroup[groupIndex].sheets)) === false 
				|| typeof vm.quote.counterGroup[groupIndex].sheets === "undefined") && (parseFloat(vm.quote.counterGroup[groupIndex].quantity) != 0) 
				|| parseFloat(vm.quote.counterGroup[groupIndex].quantity) != 0
				|| typeof vm.quote.counterGroup[groupIndex].counters[0].width ==='undefined'
				|| typeof vm.quote.counterGroup[groupIndex].estimatedSheets === 'NaN'){
				//do not let quantity go into negatives
				if(vm.quote.counterGroup[groupIndex].quantity < 0){
					vm.quote.counterGroup[groupIndex].quantity = 0;
				};
				//Define the sheets object
				var sheets = {};
				console.log(vm.quote.counterGroup[groupIndex].TAC, material.length, material.width, vm.quote.counterGroup[groupIndex].quantity, material);
				
				//Estimate the number of sheets
				//check for sheet size override, if either are not a number (null, blank wrong formatting, etc)
				console.log(parseFloat(material.overrideWidth), parseFloat(material.overrideLength), isNaN(parseFloat(material.overrideWidth)), isNaN(parseFloat(material.overrideLength)));
				if (isNaN(parseFloat(material.overrideWidth)) || isNaN(parseFloat(material.overrideLength))) {
					vm.quote.counterGroup[groupIndex].estimatedSheets = (vm.quote.counterGroup[groupIndex].areaYield / (material.length * material.width/144)) * vm.quote.counterGroup[groupIndex].quantity;
				}	else {
					vm.quote.counterGroup[groupIndex].estimatedSheets = (vm.quote.counterGroup[groupIndex].areaYield / (parseFloat(material.overrideLength) * parseFloat(material.overrideWidth)/144)) * vm.quote.counterGroup[groupIndex].quantity;
				};

				vm.quote.counterGroup[groupIndex].estimatedSheets = Math.round((vm.quote.counterGroup[groupIndex].estimatedSheets + 0.00001) * 100) / 100;
				console.log(vm.quote.counterGroup[groupIndex].estimatedSheets);
				//If sheets has not been entered (is null) make sheets = estimated, then proceed with calculating
				console.log(vm.quote.counterGroup[groupIndex].sheets, typeof vm.quote.counterGroup[groupIndex].sheets === 'undefined');
				if (typeof vm.quote.counterGroup[groupIndex].sheets === 'undefined') {
					vm.quote.counterGroup[groupIndex].sheets = vm.quote.counterGroup[groupIndex].estimatedSheets;
					//round to 2 digits
		  			vm.quote.counterGroup[groupIndex].sheets = parseFloat(vm.quote.counterGroup[groupIndex].sheets.toFixed(2));
				};
				//Calculate totals with material and number of sheets
				sheets = vm.calcSheets(material, Math.round(((vm.quote.counterGroup[groupIndex].sheets + 0.00001) * 100) / 100), overridePricing);
				//Set the quote pricing string
				vm.quote.counterGroup[groupIndex].material.pricing = sheets.pricing;
				console.log(material[sheets.pricing], sheets.pricing, material, vm.quote.counterGroup[groupIndex].sheets);
				vm.quote.counterGroup[groupIndex].GMC = material[sheets.pricing] * vm.quote.counterGroup[groupIndex].sheets;
				vm.quote.counterGroup[groupIndex].GMC = parseFloat(vm.quote.counterGroup[groupIndex].GMC.toFixed(2));
				//Set total quote GMC
				vm.quote.GMC = vm.quote.counterGroup[groupIndex].GMC;
				//console.log(vm.quote.counterGroup[groupIndex].GMC, groupIndex, vm.quote.GMC);
				//Set the total price to GMC then add up the addons to get total cost
				vm.quote.counterGroup[groupIndex].totalPrice = vm.quote.counterGroup[groupIndex].GMC;	
				//Set the total price as the material price, then add the addons
				console.log(vm.quote.totalPrice);
				vm.quote.totalPrice = vm.quote.counterGroup[groupIndex].GMC;
				console.log(vm.quote.totalPrice, vm.quote.counterGroup[groupIndex].TAC);
				//set the quote TAC
				vm.quote.TAC = vm.quote.counterGroup[groupIndex].TAC * vm.quote.counterGroup[groupIndex].quantity;

				//Update the addon quantities for the group and mandatory addon quantities and recalculate them **THIS MIGHT BE FIRING TWICE IN DIFFERENT SPOTS. MIGHT REMOVE**
				vm.updateGroupAddons(groupIndex, shape, vm.quote.counterGroup[groupIndex].TAC);
				//Add the total price for each addon to the group total price
				for (var i = vm.quote.counterGroup[groupIndex].addons.length - 1; i >= 0; i--) {
					vm.quote.counterGroup[groupIndex].totalPrice += parseFloat(vm.quote.counterGroup[groupIndex].addons[i].totalPrice);
					vm.quote.totalPrice += parseFloat(vm.quote.counterGroup[groupIndex].addons[i].totalPrice);
				};
				//Calc group material cost per square foot
				vm.quote.counterGroup[groupIndex].GMCPSF = vm.quote.counterGroup[groupIndex].GMC / (vm.quote.counterGroup[groupIndex].TAC * vm.quote.counterGroup[groupIndex].quantity);
				//Calc GCPSF = total price divided by total area of sheets required
				vm.quote.counterGroup[groupIndex].GCPSF = vm.quote.counterGroup[groupIndex].totalPrice / (vm.quote.counterGroup[groupIndex].TAC * vm.quote.counterGroup[groupIndex].quantity);
				//This is for after it's calculated once, because it adds up all OTHER counters in their groups, and then adds the new value for group total 
				if(typeof vm.quote.counterGroup[groupIndex].totalPrice !== 'undefined'){
					for (var t = vm.quote.counterGroup.length - 1; t >= 0; t--) {
						console.log(typeof(vm.quote.counterGroup[t].material), vm.quote.counterGroup[t].material === 'object')
						if(t !== groupIndex && typeof(vm.quote.counterGroup[t].material) === 'object'){							
							console.log(t, vm.quote.counterGroup[t].TAC, vm.quote.counterGroup[t].totalPrice, vm.quote.counterGroup[t].GMC);
							vm.quote.TAC += parseFloat(vm.quote.counterGroup[t].TAC) * vm.quote.counterGroup[t].quantity;
							vm.quote.totalPrice += parseFloat(vm.quote.counterGroup[t].totalPrice);
							vm.quote.GMC += parseFloat(vm.quote.counterGroup[t].GMC);
						};	
					};
					//Round that TAC
					vm.quote.TAC = Math.round((vm.quote.TAC + 0.00001) * 100) / 100;

					//Once TAC has been calculated for the whole quote, get quantities for mandatory addons
					vm.updateMandatoryAddons(groupIndex, vm.quote.TAC);
					//Add up all Mandatory addons to the total price!
					for (var i = vm.quote.mandatoryAddons.length - 1; i >= 0; i--) {
						vm.quote.totalPrice += parseFloat(vm.quote.mandatoryAddons[i].totalPrice);
					};	
					vm.quote.sheetsUsed = 0;
					for (var i = vm.quote.counterGroup.length - 1; i >= 0; i--) {
						if(typeof vm.quote.counterGroup[i].sheets !== "undefined"){
							vm.quote.sheetsUsed += vm.quote.counterGroup[i].sheets;
						};
					};
					//After adding all the other groups, then calc the quote GMCPSF and GCPSF
					//console.log(vm.quote.GMC, vm.quote.TAC, vm.quote.totalPrice)
					vm.quote.GMCPSF = vm.quote.GMC / vm.quote.TAC;
					vm.quote.GCPSF = vm.quote.totalPrice / vm.quote.TAC;
					//Gross Margin calculator
					console.log("("+vm.quote.totalPrice+"-("+vm.quote.GMC+"+("+vm.quote.TAC+"*"+LCPSF+")+("+vm.quote.TAC+"*"+CCPSF+"))/"+vm.quote.totalPrice);
					var LCCC = (vm.quote.TAC * LCPSF) + (vm.quote.TAC * CCPSF);
					console.log("LCCC ", LCCC);
					vm.quote.QGM = (vm.quote.totalPrice - (vm.quote.GMC + LCCC)) / vm.quote.totalPrice;
					vm.quote.QGM = Math.round((vm.quote.QGM + 0.00001) * 100) / 100;
					console.log(vm.quote.QGM);
				};	
			};	
		};

		vm.calcMandatoryAddons = function(){
			//start with just the GMC
			vm.quote.totalPrice = vm.quote.GMC;
			//add up the price for mandatory addons
				for (var i = vm.quote.mandatoryAddons.length - 1; i >= 0; i--) {
					vm.quote.totalPrice += vm.quote.mandatoryAddons[i].totalPrice;
				};	
			//Recalc the GCPSF
			vm.quote.GCPSF = vm.quote.totalPrice / vm.quote.TAC;
		};

		vm.calcSheets = function(material, sheets, overridePricing){
		console.log(sheets);
		//Create sheets object
			var returnObj = {
				sheets : 0,
				pricing: ''
			};
			/*I don't know if overridePricing is even being used, but keeping it in case it breaks anything.*/
			//Checks to see how many sheets are required
			if(typeof overridePricing === 'undefined') {
			//Chooses the best match for pricing. Will need to make this user selectable later.
				if(material.fullSheet21 && sheets >= 21) {
					returnObj.pricing = "fullSheet21";
				} else if (material.fullSheet5 && sheets >= 5) {
					returnObj.pricing = "fullSheet5";
				} else if (material.fullSheet1 && sheets >= .51) {
					returnObj.pricing = "fullSheet1";
				} else if (material.halfSheet && sheets >= .26) {
					//it will round down to 0, so make it one sheet
					returnObj.sheets = .5;
					returnObj.pricing = "halfSheet";
				} else if (material.quarterSheet && sheets <= .25) {
					//it will round down to 0, so make it one sheet
					returnObj.sheets = .5;
					returnObj.pricing = "quarterSheet";
				} else {
					returnObj.pricing = "fullSheet1";
				};
			} else {
				console.log("Pricing override");
				returnObj.pricing = overridePricing;
			};
			//set the fraction of sheets to 2 digits.
			returnObj.sheets = returnObj.sheets.toFixed(2);
			console.log(returnObj);
			return(returnObj);
		};

		vm.saveQuote = function(description, currentUser) {
			//save the quote
			
			//console.log("currentUser", currentUser, "Typeof currentUser", typeof currentUser, "vm account", vm.quote.account, "vm currentUsername", vm.quote.account.currentUserName);
			if(typeof vm.quote.account === 'undefined' || typeof vm.quote.account.currentUserName === 'undefined'){
				vm.quote.account = {
				    currentUserName : currentUser.currentUserName,
				    firstName : currentUser.firstName,
				    lastName : currentUser.lastName,
				    accountType : currentUser.accountType,
				    email : currentUser.email,
				    phoneNumber : currentUser.phoneNumber
				};
			}; 
			vm.quote.lastSavedBy = currentUser.currentUserName;
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
	};

	angular.module('surfacingSolutions')
	.filter('dateFilter', function() {
    return function(input, term) {
    	if(term.calendar == "false"){
    		return term.term;
    	} else {
    		var output = "";
    		//replace *date* with actual date
    		output = term.term.replace("*date*", term.date.substring(0, 10));
			return output;
    	};
    };
  });

}());