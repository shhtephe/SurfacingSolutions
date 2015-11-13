var customers = require('../models/customers');
var mongoose = require('mongoose');

exports.createCustomer = function(customerData, next){
  console.log(customerData);
	highCode = mongoose.model("customers").findOne().sort({custCode : "desc"}).exec(function(err, oldCustomer){
    console.log("Latest Customer:", oldCustomer);

    if (oldCustomer == null) {
      highCode = 1;
    } else {
      highCode = oldCustomer.custCode + 1;
    }
    console.log("New Customer number: " + highCode);  
    
    var       
      firstName= customerData.firstName,
      lastName= customerData.lastName,
      companyName = customerData.companyName,
      email = customerData.email,
      addressLine1 = customerData.addressLine1,
      addressLine2 = customerData.addressLine2,
      city = customerData.city,
      postal = customerData.postal,
      province = customerData.province,
      homePhone = customerData.homePhone,
      mobilePhone = customerData.mobilePhone,
      custCode = highCode

    var newCustomer = new customers({
		  firstName: firstName,
    	lastName: lastName,
    	companyName: companyName,
    	email: email,
    	addressLine1: addressLine1,
    	addressLine2: addressLine2,
    	city: city,
    	postal: postal,
    	province: province,
    	homePhone: homePhone,
    	mobilePhone: mobilePhone,
    	custCode: highCode
    });
    console.log("New Customer: ",newCustomer);
    newCustomer.save(function (err, customer) {
      if (err) {
        return next(err);
      }
      next(null);
    });
  });
};