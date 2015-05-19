var app = angular.module('surfacingSolutions', ['ui.router', 'angular.filter', 'ui.bootstrap']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home',
      data: {
        requireLogin: false
      }
      //controller: 'mainCtrl'
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
      }
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
      controller: 'quoteCtrl'
  })
    .state('customers', {
      url: '/customers',
      templateUrl: '/customers',
            data: {
        requireLogin: true
      },
      controller: 'customersCtrl'
  })
  .state('newCustomer', {
      url: '/newcustomer',
      templateUrl: '/newcustomer',
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
      controller: 'customerCtrl'
  })
    .state('otherwise', { 
      url : '/index',
      templateUrl: '/home',
      data: {
        requireLogin: false
      }
  });

  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('home');
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