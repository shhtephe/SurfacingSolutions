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
      companyName     = customerData.companyName, 
      addressLine1    = customerData.addressLine1,
      addressLine2    = customerData.addressLine2,
      city            = customerData.city,
      province        = customerData.province,
      postal          = customerData.postal,
      businessPhone   = customerData.businessPhone,
      businessFax     = customerData.businessFax,
      contacts        = customerData.contacts,
      custCode        = highCode

    var newCustomer = new customers({
		  companyName    :   companyName,
    	addressLine1   :   addressLine1,
    	addressLine2   :   addressLine2,
    	city           :   city,
      province       :   province,
    	postal         :   postal,
    	businessPhone  :   businessPhone,
      businessFax    :   businessFax,
      contacts       :   contacts,
    	custCode       :   highCode
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