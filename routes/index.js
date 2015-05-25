var express = require('express');
var router = express.Router();
var passport = require('passport');
//mongoose schemas
var account = require('../models/account'); 
var product = require('../models/products'); 
var quotes = require('../models/quotes'); 
var customers = require('../models/customers'); 
var customerSchema = require('../models/customers');
var materials = require('../models/materials');
//mongoose
var mongoose = require('mongoose');
//Recieve JSON from Angular
var http = require('http');


//I might have to ditch the error handler. Currently used in router.param(quote)
function errorHandler(err, req, res, next) {
  console.log(err);
  //res.status(500);
  //res.render('error', { error: err });
}

//html5 refresh fix
/*router.all("/*", function(req, res) {
    console.log("Router Get all ran");
    res.render("index", { user : req.user });
});*/

/* GET home page. */
router.get('/home', function(req, res, next) {
  console.log("This has ran");
  res.render('partials/home', { title: 'Express' });
});

router.param('customer', function(req, res, next, custCode) {
  var query = {};
      query["custCode"] = custCode;

  var search = mongoose.model("customers").findOne(query);

  search.exec(function (err, customer){
    if (err) { return next(err); }
    if (!customer) { return next(new Error('can\'t find Customer')); }

    req.customer = customer;
    console.log("Param customer");
    console.log(req.customer);
    return next();
  });
});

router.get('/customer/:customer', function(req, res, next) {

  req.customer.populate('customer', function(err, customer) {
    if (err) { return next(err); }
    var query = {};
    query["custCode"] = customer.custCode;

    var search = mongoose.model("quote").find(query);

    search.exec(function (err, quotes){
    if (err) { return next(err); }
    if (!quotes) { return next(new Error('can\'t find Quotes')); }
      req.customer = customer;
      res.render('partials/customer', { 
      customer: customer,
      quotes: quotes
    });
  });
  });
});

/*apparently will save me work, but I don't think it will.
Supposed to run every time there's 'quote' in a url*/
router.param('quote', function(req, res, next, quoteID) {
  var query = {};
  query["quoteID"] = quoteID;
  query["custCode"] = req.customer.custCode;

  var search = mongoose.model("quote").find(query);
  search.exec(function (err, quote){
    if (err) {return next(err); }
    if (typeof quote[0]==="undefined") {
      //Instead of just hitting next, we replace the quote with a new one
      var query = {};
      query["custCode"] = req.customer.custCode;
      search = mongoose.model("quote").findOne().sort({quoteID : "desc"}).exec(function(err, quote){
      
      var quoteID 

        if(quote == null){
          quoteID=1;  
        }
        else {
          quoteID = quote.quoteID + 1
        }

        var custCode = req.customer.custCode,
        totalPrice = 0,
        jobDifficulty = 0,
        counters = []

        console.log("quote ID!")
        console.log(quoteID);

        var newQuote = new quotes({
          quoteID: quoteID,
          custCode: custCode,
          totalPrice: totalPrice,
          jobDifficulty: jobDifficulty,
          counters: []
        });

        newQuote.save(function (err, quote) {
          if (err) {return errorHandler(err);
          }
          else {
          // saved!
          console.log(quote);
          console.log("Quote saved");
          req.quote = quote;
          console.log("Param Quote");
          console.log(req.quote);
          return next();
          }
        });
      });
    }
    else{
      req.quote = quote;
      console.log("Param Quote");
      console.log(req.quote);
      return next();
    }
  });
});

router.get('/customer/:customer/quote/:quote', function(req, res, next) {
  if (typeof req.quote[0]==="undefined") {
      mongoose.model("products").find(function(err, products){
        mongoose.model("materials").find(function(err, materials){
          console.log(materials);
          res.render('partials/quote', { 
            quote: req.quote,
            customer: req.customer,
            products: products,
            materials: materials
          });
        });
    })
  }
  else{
    mongoose.model("products").find(function(err, products){
      mongoose.model("materials").find(function(err, materials){
        res.render('partials/quote', { 
          quote: req.quote[0],
          customer: req.customer,
          products: products,
          materials: materials
        });
      });
    })
  }
});

router.get('/admin', function(req, res, next) {
  mongoose.model("products").find(function(err, products){
    mongoose.model("materials").find(function(err, materials){
      res.render('partials/admin', { 
        products: products,
        materials: materials
      });
    });
  });
});

router.get('/newcustomer', function(req, res, next) {
  res.render('partials/newcustomer', { save: false });
});

router.post('/newcustomer', function(req, res) {


  var highCode=0;
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

    console.log("New Customer number: " + highCode);  

    var firstName = req.body.firstName,
    lastName = req.body.lastName,
    companyName = req.body.companyName,
    email = req.body.email,
    addressLine1 = req.body.addressLine1,
    addressLine2 = req.body.addressLine2,
    postalCode = req.body.postalCode,
    city = req.body.city,
    homePhone = req.body.homePhone,
    mobilePhone = req.body.mobilePhone;
    
    var newCustomer = new customerSchema({
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      email: email,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      postalCode: postalCode,
      city: city,
      homePhone: homePhone,
      mobilePhone: mobilePhone,
      custCode: highCode
    });



    newCustomer.save(function (err, customer) {
      if (err) {
        console.log("There is an error");
        console.log(err);
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

router.post('/savenewmaterial', function(req, res) {
  console.log(req.body);
  var newMaterial = new materials({
    colourGroup: req.body.materials.colourGroup,
    colour: req.body.materials.colour,
    price: req.body.materials.price
  });
  newMaterial.save(function (err, materials) {
    if (err) {
      console.log("Errors: " + err);
      res.sendStatus(500);
    }
    else {
      // saved!
      console.log("Saved!")
      res.send();
    }
  });
});

router.post('/savematerial', function(req, res) {

});

router.post('/saveproduct', function(req, res) {
  console.log(req.body);
  var conditions = {category: req.body.products.productCategory, product: req.body.productProduct }
    , update = {price: req.body.productPrice, unitOfMeasure: req.body.productUnitOfMeasure, chargeType: req.body.productChargeType}
    , options = { multi: false};

  mongoose.model('products').update(conditions, update, options, callback);

  function callback (err, numAffected) {
    //numAffected is the number of updated documents
    if(err) {
      console.log("Errors: " + err);
      res.sendStatus(500);
    }
    else {
      console.log("Number of rows Affected: " + numAffected);
      mongoose.model("products").find(function(err, products){
        //blanked out until page refresh is figured out.
        //res.render('partials/admin', { 
        //products: products,
        //save: ""
      //});
      });
    }
  }
});

router.post('/savequote', function(req, res){
  console.log(req.body.quote);

  var conditions = {quoteID: req.body.quote.quoteID, custCode: req.body.quote.custCode}
  , update = req.body.quote
  , options = { multi: false};

  mongoose.model('quote').update(conditions, update, options, callback);
  function callback (err, numAffected) {
    //numAffected is the number of updated documents
    if(err) {
      console.log("Errors: " + err);
      res.sendStatus(500);
    }
    else {
      console.log("Quote Saved!");
      res.send("No Error"); 
    }
  }
});

//"Search" GET. 
  /*router.get('/search', function(req, res, next) {
      mongoose.model('customers').find(function(err, customers){
      res.render('partials/search', { 
        data: products
      });
    });
  });*/

//"Search" POST. Likely not using it at all.
  /*router.post('/search', function(req, res) {
    var firstName=req.body.firstName,
    lastName=req.body.lastName,
    companyName=req.body.companyName,
    email=req.body.email;

    console.log(req.body.firstName);

    //generate query object based on availability of value 
    var query = {};
    if( firstName ) {
        query["firstName"] = firstName;
    }
    if( lastName ) {
        query["lastName"] = lastName;
    }
    if( companyName ) {
        query["companyName"] = companyName;
    }
    if( email ) {
        query["email"] = email;
    }
    mongoose.model('customers').find(query, function(err, data) {
        console.log(data);
    });
  });*/

router.get('/customers', function(req, res, next) {
  mongoose.model('customers').find(function(err, data) {
      res.render('partials/customers', { data: data });
  }); 
});

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('partials/register', { user : req.user });
});

router.post('/register', function(req, res) {
    account.register(new account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("index", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

;
router.get('/login', function(req, res) {
    res.render('partials/login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
  res.send("Get Request to ping!");
});

router.post('/ping', function(req, res){
  res.send("Post Request to ping!");
});

module.exports = router;