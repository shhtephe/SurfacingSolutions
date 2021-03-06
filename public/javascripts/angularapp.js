var app = angular.module('surfacingSolutions', ['ui.router', 'angular.filter', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngMask', 'hl.sticky']);

app.config([
'$interpolateProvider',
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function($interpolateProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home',
      data: {
        requireLogin: false
      },
      controller: 'homeCtrl',
      controllerAs: 'vm'
    })
    .state('login', {
  		url: '/login',
  		templateUrl: '/login',
            data: {
        requireLogin: false
      }
  		//controller: 'loginCtrl'
	})
    .state('userAdmin', {
      url: '/useradmin',
      templateUrl: '/useradmin',
            data: {
        requireLogin: true
      },
      controller: 'userAdminCtrl',
      controllerAs: 'vm'
  })
    .state('register', {
      url: '/register',
      templateUrl: '/register',
            data: {
        requireLogin: true
      },
      controller: 'registerCtrl',
      controllerAs: 'vm'
  })
    .state('pricing', {
  		url: '/pricing',
  		templateUrl: '/pricing',
            data: {
        requireLogin: true
      },
      controller: 'pricingCtrl',
      controllerAs: 'vm'
	})
    .state('remnants', {
      url: '/remnants',
      templateUrl: '/remnants',
            data: {
        requireLogin: true
      },
      controller: 'remnantsCtrl',
      controllerAs: 'vm'
  })
    .state('search', {
  		url: '/search',
  		templateUrl: '/search',
            data: {
        requireLogin: true
      },
  		controller: 'searchCtrl'
	})
    .state('quotebuild', {
      url: '/customer/{custCode}/quotebuild/{quoteID}',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode + '/quotebuild/' + stateParams.quoteID;
      },
      data: {
        requireLogin: true
      },
      controller: 'quoteCtrl',
      controllerAs: 'vm'
  })
    .state('quotefinal', {
      url: '/customer/{custCode}/quotebuild/{quoteID}/quotefinal',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode + '/quotebuild/' + stateParams.quoteID + '/quotefinal';
      },
      data: {
        requireLogin: true,
      },
      controller: 'quoteFinalCtrl',
      controllerAs: 'vm',
      css: ['stylesheets/quoteprint.css','stylesheets/quotestyle.css']
  })
    .state('quotesend', {
      url: '/customer/{custCode}/quotebuild/{quoteID}/quotesend',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode + '/quotebuild/' + stateParams.quoteID + '/quotesend';
      },
      data: {
        requireLogin: false,
      },
      controller: 'quoteFinalCtrl',
      controllerAs: 'vm',
      css: ['stylesheets/quoteprint.css','stylesheets/quotestyle.css']
  })
    .state('customersAdmin', {
      url: '/customersadmin',
      templateUrl: '/customersadmin',
            data: {
        requireLogin: true
      },
      controller: 'customersAdminCtrl',
      controllerAs: 'vm'
  })
    .state('customers', {
      url: '/customers',
      templateUrl: '/customers',
            data: {
        requireLogin: true
      },
      controller: 'customersCtrl',
      controllerAs: 'vm'
  })
  .state('newCustomer', {
      url: '/customers/create',
      templateUrl: '/customers/create',
            data: {
        requireLogin: true
      },
      controller: 'newCustomerCtrl',
      controllerAs: 'vm'
  })
    .state('logout', {
      url: '/logout',
      templateUrl: '/home',
            data: {
        requireLogin: true
      }
      //controller: 'searchCtrl'
	})
    .state('customer', {
      url: '/customer/{custCode}',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode;
      },
      data: {
        requireLogin: true
      },
      controller: 'customerCtrl',
      controllerAs: 'vm'
  })
    .state('otherwise', { 
      url : '/index',
      templateUrl: '/home',
      data: {
        requireLogin: false
      }
  });

  //$locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('home');

  //to fix handlebars not using the mustaches
  $interpolateProvider.startSymbol('{/');
  $interpolateProvider.endSymbol('/}');
}]);
 
app.run(function ($rootScope, $state) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && $rootScope.currentUser == false) {
      event.preventDefault();
    };
  });

});