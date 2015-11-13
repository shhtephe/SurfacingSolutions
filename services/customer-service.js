var customers = require('../models/customers').Customer;
var mongoose = require('mongoose');

exports.createCustomer = function(customer, next){
  console.log(customer);
	highCode = mongoose.model("customers").findOne().sort({custCode : "desc"}).exec(function(err, oldCustomer){
    console.log("Latest Customer:", oldCustomer);

    if (oldCustomer == null) {
      highCode = 1;
    } else {
      highCode = oldCustomer.custCode + 1;
    }
    console.log("New Customer number: " + highCode);  
    
	var newCustomer = new customers({
		  firstName: customer.firstName,
    	lastName: customer.lastName,
    	companyName: customer.companyName,
    	email: customer.email,
    	addressLine1: customer.addressLine1,
    	addressLine2: customer.addressLine2,
    	city: customer.city,
    	postal: customer.postal,
    	province: customer.province,
    	homePhone: customer.homePhone,
    	mobilePhone: customer.mobilePhone,
    	custCode: highCode
	});*/
  console.log("New Customer: ",newCustomer);
    newCustomer.save(function (err, customers) {
      if (err) {
        console.log("Errors: " + err);
      }
      else {
        res.redirect('/customers');
      };
    });
  });
};