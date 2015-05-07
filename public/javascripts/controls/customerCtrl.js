'use strict';

app.controller('customerCtrl', 
  ['$scope', '$location' , function ($scope, $location) {
    $scope.newQuote = function(quotes, custCode){

		var max = Math.max.apply(null, quotes.map(function(item){
		   return item["quoteID"];
		}));

		if(max > 0){
			max ++;
		}
		else {
			max = 1;
		}
		console.log(max);
		console.log(custCode);
		var path = "/customer/" + custCode + "/quote/" + max;

		$location.path( path );
    };
}]);