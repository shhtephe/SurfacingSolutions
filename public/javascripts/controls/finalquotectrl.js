'use strict';

app.controller('finalQuoteCtrl', 
	['$scope', '$state', function ($scope, $state) {

	}]);

app.filter('flattenRows', function() {
    return function(counters) {
      var flatten = [];
      angular.forEach(counters, function(counter) {
        addons = counter.addons;
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