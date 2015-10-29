var express = require('express');
var router = express.Router();
var passport = require('passport');

//var config = require('../config');

/* GET customers listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log("worked");
});

// GET /customer/create
router.get('/create', function(req, res, next) {
  var vm = {
    title:'Add a customer'
  };
  res.render('partials/customers/create', vm);
});

module.exports = router;

router.post('/create', function(req, res) {
  /*var highCode=0;
  //find customer with highest id and make new one with increment of one
  highCode = mongoose.model("customers").findOne().sort({custCode : "desc"}).exec(function(err, customer){
    console.log("Latest Customer:");
    console.log(typeof customer);
    console.log(customer);

    if (customer == null) {
      highCode = 1;
    } else {
      highCode = customer.custCode + 1;
      console.log("Customer code:" + customer.custCode); 
    }
    console.log(req.body.companyName);
    console.log("New Customer number: " + highCode);  

    var firstName = req.body.firstName,
    lastName = req.body.lastName,
    companyName = req.body.companyName,
    email = req.body.email,
    addressLine1 = req.body.addressLine1,
    addressLine2 = req.body.addressLine2,
    city = req.body.city,
    postal = req.body.postal,
    province = req.body.province,
    homePhone = req.body.homePhone,
    mobilePhone = req.body.mobilePhone;
    
    var newCustomer = new customerSchema({
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

    newCustomer.save(function (err, customer) {
      if (err) {
        console.log("There is an error");
        console.log(err);
        var vm = {
			title: 'Add a customer',
			input: req.body,
			error: err
        }
        res.render('partials/customers/create', vm);
      }
      else {
        // saved!
        console.log(newCustomer);
        console.log("Customer Saved");
      }
    });
  });
  res.render('partials/newcustomer', {
    save: "User has been created!"
  });
});