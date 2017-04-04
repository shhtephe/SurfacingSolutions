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

        vm.links = [
        	{"name":"Avonite","url":"http://www.avonite.com/colors/"},
			{"name":"Casarstone","url":"http://www.caesarstone.ca/collections/"},
			{"name":"Corian","url":"http://www.corian.com/-colors-of-corian-r-"},
			{"name":"Formica","url":"http://www.formica.com/en/ca/products/formica-solid-surfacing-home#swatchesTab"},
			{"name":"Hanex Solid Surface","url":"http://hanwhasurfaces.com/site/hanexcollection"},
			{"name":"Hanstone Quartz","url":"http://hanwhasurfaces.com/site/hanstonecollection"},
			{"name":"Icestone","url":"https://icestoneusa.com/products/icestone/"},
			{"name":"Kstone Quartz","url":"https://www.kstonecollections.com/gallery"},
			{"name":"LG Hi-Macs","url":"http://www.lghimacsusa.com/productOverviews/33/by-product-line"},
			{"name":"LG Viatera","url":"http://www.lgviaterausa.com/productOverviews/83/by-product-line"},
			{"name":"Meganite","url":"https://www.meganite.com/en_ww/colors/"},
			{"name":"Olympia Tile+Stone","url":"http://www.olympiatile-slabs.com"},
			{"name":"Silestone","url":"https://ca.silestone.com/colours/"},
			{"name":"Staron","url":"http://www.leezasurfaces.com/products.php?type=Staron"},
			{"name":"TCE Stone","url":"http://tcestone.com/?page_id=299"},
			{"name":"Wilsonart","url":"http://www.wilsonart.com/solid-surface/design-library"},
			{"name":"Zodiac","url":"http://www.zodiaq.com/-colors- of-zodiaq-r-"}
		];
    };
}());