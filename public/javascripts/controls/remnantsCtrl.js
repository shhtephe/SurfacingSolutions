(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('remnantsCtrl', remnantsCtrl);

	remnantsCtrl.$inject = ['dataFactory'];

	function remnantsCtrl(dataFactory) {
		var vm = this;
		dataFactory.getProductsMaterials()
        .then(function(data) {
          vm.products = data.products;
          vm.materials = data.materials;
        })
      	dataFactory.getRemnants()
        .then(function(data) {
          vm.remnants = data.remnants;
        })

	}; 
}());