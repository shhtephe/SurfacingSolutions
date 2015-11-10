var app = angular.module('surfacingSolutions', ['ui.router', 'angular.filter', 'ui.bootstrap']);

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
    .state('register', {
      url: '/register',
      templateUrl: '/register',
            data: {
        requireLogin: true
      }
      //controller: 'loginCtrl'
  })
    .state('admin', {
  		url: '/admin',
  		templateUrl: '/admin',
  		controller: 'adminCtrl',
            data: {
        requireLogin: true
      },
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
    .state('quote', {
      url: '/customer/{custCode}/quote/{quoteID}',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode + '/quote/' + stateParams.quoteID;
      },
      data: {
        requireLogin: true
      },
      controller: 'quoteCtrl',
      controllerAs: 'vm'
  })
    .state('finalquote', {
      url: '/customer/{custCode}/quote/{quoteID}/quotefinal',
      templateUrl: function(stateParams){
        return '/customer/' + stateParams.custCode + '/quote/' + stateParams.quoteID + '/quotefinal';
      },
      data: {
        requireLogin: true
      },
      controller: 'finalQuoteCtrl',
      css: ['stylesheets/quoteprint.css','stylesheets/quotestyle.css'],
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
      controller: 'newCustomerCtrl'
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


      /*loginModal()
        .then(function () {
          return $state.go(toState.name, toParams);
        })
        .catch(function () {
          return $state.go('welcome');
        });*/
    }
  });

});