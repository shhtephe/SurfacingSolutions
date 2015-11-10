	(function() {
	'use strict';
	angular
		.module('surfacingSolutions')
		.controller('homeCtrl', homeCtrl);

	function homeCtrl($scope) {
		var vm = this;
		vm.data = 'the data'; //use vm.data in the view
		console.log (vm.data);
	};	
}());
	