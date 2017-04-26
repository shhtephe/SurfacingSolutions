(function() {
	'use strict';
	
	angular
	.module('surfacingSolutions')
	.controller('userAdminCtrl', userAdminCtrl);

	userAdminCtrl.$inject = ['dataFactory', '$http', '$uibModal'];

	function userAdminCtrl(dataFactory, $http, $uibModal) {
		var vm = this; 

		vm.alerts = [];

      	dataFactory.getAccounts()
        .then(function(data) {
          vm.accounts = data.accounts;
        })

		vm.accountEditModal = function (account, index) {
	        var modalInstance = $uibModal.open({
	          animation: true,
	          templateUrl: 'accountEdit.html',
	          controller: ['$uibModalInstance', 'account', accountEditCtrl],
	          controllerAs: 'vm',
	          resolve: {
	            account: function() {return account;}
	            }
	          });

	            modalInstance.result.then(function (account) {
	            //Save the account and put all the data back onto the main controller
	            vm.saveAccount(account, "update");               
	      	}, function () {
	          console.log('Modal dismissed at: ' + new Date());
	        });
	    };

	    //Contact modal Controller
	    var accountEditCtrl = function($uibModalInstance, account) {
	    	console.log($uibModalInstance, account)
	      	var vm = this;
	      	vm.account = account;
	      	vm.changePassword = function(account, password) {

	      	};

	        vm.submitAccountEdit = function(account) {
	    		$uibModalInstance.close(account);
		    };

		    vm.cancel = function() {
		        $uibModalInstance.dismiss('cancel');
		    };
	   	};

	    vm.deleteAccountModal = function(ev, account, index) {
	        // Appending dialog to document.body to cover sidenav in docs app
	        var confirm = $mdDialog.confirm()
	              .title('Delete Account')
	              .textContent('Are you sure you want delete ' + account.firstName + "'s account?")
	              //.placeholder('Enter an Email')
	              .ariaLabel('Delete User')
	              //.initialValue(vm.customer.email)
	          .targetEvent(ev)
	              .ok('Delete')
	              .cancel('Cancel');

	        $mdDialog.show(confirm).then(function(result) {
	          console.log("User chose to delete account");
	          vm.deleteAccount(index, account);
	        }, function() {
	          console.log("User Cancelled.");
	        });
	    };

		vm.deleteAccount = function(index, account) {
	        console.log("Account deleted", index);
	        vm.accounts.splice(vm.arraySearch(account._id, vm.accounts, '_id'), 1);
	        vm.saveAccount(account, "remove");
      	};

      	vm.saveAccount = function(account, action) {
	        //declaring json data
	        console.log("Save account ran")
	        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
	        $http.post('/saveaccount', {"account":account, "action": action}).
	        	success(function(data, status, headers, config) {
	            // this callback will be called asynchronously
	            // when the response is available
	            if(action == 'add'){
	              vm.addAlert("success", "Account " + action + "ed successfully");
	            } else {
	              vm.addAlert("success", "Account " + action + "d successfully");
	            };
	        })
	        .error(function(data, status, headers, config) {
	        	// called asynchronously if an error occurs
	            // or server returns response with an error status.
	            vm.addAlert("danger", "Error: Material did not " + action);
	            console.log("Nope.jpg");
   			});
      	};

		//set option to 'user'
		//$scope.userForm.accountType = 'user';

		vm.submit = function(form, user){
			console.log(form);
			if(user.accountType !== "admin" && form.accountType === "admin" ) {
				vm.addAlert("warning", "Standard user cannot create an admin account.");
			} else if(user.accountType === "admin" || form.accountType === "user"){
				if(form.password === form.password2) {
					var data = {
						firstName: form.firstName,
						lastName: form.lastName,
						username:form.username, 
						accountType:form.accountType,
						email:form.email, 
						phoneNumber:form.phoneNumber,
						password:form.password
					};

					$http.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
					$http.post('/register', {"data":data}).
			  		success(function(data, status, headers, config) {
				    	// this callback will be called asynchronously
				    	// when the response is available
				    	vm.addAlert("success","New User has been created!");
				  	}).
			  		error(function(data, status, headers, config) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
						vm.addAlert("danger", data.error);
			  		});
		  		}
			  	else {
			  		vm.addAlert("warning", "Password entered does not match.");
				};
			};
		};
		vm.addAlert = function(type, msg) {
	      vm.alerts.push({
	        type: type,
	        msg: msg
	      });
	    };
	   	vm.closeAlert = function(index) {
		    vm.alerts.splice(index, 1);
	  	};
	};
}());