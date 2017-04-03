(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('remnantsViewCtrl', remnantsViewCtrl);

	remnantsViewCtrl.$inject = ['dataFactory'];

	function remnantsViewCtrl(dataFactory) {
		var vm = this;
      	dataFactory.getRemnants()
        .then(function(data) {
          vm.remnants = data;
          console.log(vm.remnants)
        })
    };
}());