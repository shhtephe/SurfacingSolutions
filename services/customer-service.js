var Customer = require('../models/customers').Customer;
var mongoose = require('mongoose');

exports.createCustomer = function(customer, next){
	highCode = mongoose.model("Customer").findOne().sort({custCode : "desc"}).exec(function(err, customer){
    console.log("Latest Customer:");
    console.log(typeof customer);
    console.log(customer);

    if (customer == null) {
      highCode = 1;
    } else {
      highCode = customer.custCode + 1;
      console.log("Customer code:" + customer.custCode); 
    }
    console.log(customer.companyName);
    console.log("New Customer number: " + highCode);  
    
	var newCustomer = new Customer({
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
	});

    newCustomer.save(function (err) {
      if (err) {
        return next(err);
      }
      next(null);
    });
  });
};