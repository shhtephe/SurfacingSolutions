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
          vm.remnants = data.remnants;
          console.log(vm.remnants)
        })

        vm.links = [
        	{"name":"Avonite","url":"http://www.avonite.com/colors/", "type":"Acrylic"},
			{"name":"Corian","url":"http://www.corian.com/-colors-of-corian-r-", "type":"Acrylic"},
			{"name":"Formica","url":"http://www.formica.com/en/ca/products/formica-solid-surfacing-home#swatchesTab", "type":"Acrylic"},
			{"name":"Hanex Solid Surface","url":"http://hanwhasurfaces.com/site/hanexcollection", "type":"Acrylic"},
			{"name":"LG Hi-Macs","url":"http://www.lghimacsusa.com/productOverviews/33/by-product-line", "type":"Acrylic"},
			{"name":"Meganite","url":"https://www.meganite.com/en_ww/colors/", "type":"Acrylic"},
			{"name":"Staron","url":"http://www.leezasurfaces.com/products.php?type=Staron", "type":"Acrylic"},
			{"name":"Wilsonart","url":"http://www.wilsonart.com/solid-surface/design-library", "type":"Acrylic"},
			{"name":"Casarstone","url":"http://www.caesarstone.ca/collections/", "type":"Quartz"},
			{"name":"Icestone","url":"https://icestoneusa.com/products/icestone/", "type":"Quartz"},
			{"name":"Kstone Quartz","url":"https://www.kstonecollections.com/gallery", "type":"Quartz"},
			{"name":"LG Viatera","url":"http://www.lgviaterausa.com/productOverviews/83/by-product-line", "type":"Quartz"},
			{"name":"Olympia Tile+Stone","url":"http://www.olympiatile-slabs.com", "type":"Quartz"},
			{"name":"Silestone","url":"https://ca.silestone.com/colours/", "type":"Quartz"},
			{"name":"TCE Stone","url":"http://tcestone.com/?page_id=299", "type":"Quartz"},
			{"name":"Zodiac","url":"http://www.zodiaq.com/-colors- of-zodiaq-r-", "type":"Quartz"},
			{"name":"Hanstone Quartz","url":"http://hanwhasurfaces.com/site/hanstonecollection", "type":"Quartz"}
		];

		vm.printScreen = function(divName) {
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=300,height=300');
			popupWin.document.open();
			popupWin.document.write('<html><head> '
				+ '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">'
				+ ' <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">'
				+ ' <link rel="stylesheet" type="text/css" href="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.1/angular-material.css"/>'
				+ ' </head> <body onload="window.print()"> <br><br>' + printContents + '</body> </html>');
			popupWin.document.close();
		};
    };
}());