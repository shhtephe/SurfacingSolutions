var express = require('express');
var router = express.Router();
var passport = require('passport');
//mongoose schemas
var account = require('../models/account'); 
var quotes = require('../models/quotes'); 
var customers = require('../models/customers'); 
var customerSchema = require('../models/customers');
var products = require('../models/products'); 
var materials = require('../models/materials');
//mongoose
var mongoose = require('mongoose');
//express-mailer
mailer = require('express-mailer');
//Recieve JSON from Angular
var http = require('http');


//I might have to ditch the error handler. Currently used in router.param(quote)
function errorHandler(err, req, res, next) {
  console.log(err);
  //res.status(500);
  //res.render('error', { error: err });
}

//html5 refresh fix
/*router.all("/*", function(req, res, next) {
    res.render("index", { user : req.user });
});*/

/* GET home page. */
router.get('/home', function(req, res, next) {
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
      console.log(quotes);
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
          jobDifficulty: 1,
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

router.get('/customer/:customer/quote/:quote/invoice', function(req, res, next) {
  if (typeof req.quote[0]==="undefined") {
      mongoose.model("products").find(function(err, products){
        mongoose.model("materials").find(function(err, materials){
          console.log(materials);
          res.render('partials/invoice', { 
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
        res.render('partials/invoice', { 
          quote: req.quote[0],
          customer: req.customer,
          products: products,
          materials: materials
        })
      })
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
    console.log(req.body.companyName);
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

router.post('/savematerials', function(req, res, next) {
  console.log(req.body.material);
  console.log(req.body.action);
  console.log(req.body.parameter);


  if(req.body.action === "update"){
    console.log(req.body.material.distributor);
    console.log(req.body.material.manufacturer);
    console.log(req.body.material.colourGroup);
    console.log(req.body.material.description);
    var material = req.body.material;

    var conditions = {distributor: req.body.material.distributor, manufacturer: req.body.material.manufacturer, colourGroup: req.body.material.colourGroup, description: req.body.material.description}
      , update = {
        itemCode : material.itemCode,
        thickness : material.thickness,
        length : material.length,
        width : material.width,
        fullSheet1 : material.fullSheet1,
        halfSheet : material.halfSheet,
        fullSheet5 : material.fullSheet5,
        fullSheet21 : material.fullSheet21,
        isa : material.isa,
        collection : material.collection
      }
      , options = { multi: false};

    mongoose.model('materials').update(conditions, update, options, callback);
    function callback (err, numAffected) {
      //numAffected is the number of updated documents
      if(err) {
        console.log("Errors: " + err);
        res.sendStatus(500);
      }
      else {
        console.log("Number of rows Affected: " + numAffected);
          res.sendStatus(200);
      };
    };
  } else if(req.body.action === "delete"){
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.parameter)};
  console.log(query);
    var search = mongoose.model("materials").find(query);

    search.remove().exec(function (err, searchMaterial){
      if (err) { return next(err); }
      if (!searchMaterial) { return next(new Error('can\'t find Material')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });
  } else if(req.body.action === "add"){
    bodyMaterials = req.body.material;
    console.log(bodyMaterials);

    console.log(bodyMaterials.manufacturer);
    //I didn't need to do this part, it's a bit redundant.
    var manufacturer = bodyMaterials.manufacturer,
        distributor = bodyMaterials.distributor,
        description = bodyMaterials.description,
        itemCode = bodyMaterials.itemCode,
        colourGroup = bodyMaterials.colourGroup,
        thickness = bodyMaterials.thickness,
        length = bodyMaterials.length,
        width = bodyMaterials.width,
        fullSheet1 = bodyMaterials.fullSheet1,
        halfSheet = bodyMaterials.halfSheet,
        fullSheet5 = bodyMaterials.fullSheet5,
        fullSheet21 = bodyMaterials.fullSheet21,
        isa = bodyMaterials.isa,
        matCollection = bodyMaterials.matCollection;

    var newMaterial = new materials({
        manufacturer : manufacturer,
        distributor : distributor,
        description : description,
        itemCode : itemCode,
        colourGroup : colourGroup,
        thickness : thickness,
        length : length,
        width : width,
        fullSheet1 : fullSheet1,
        halfSheet : halfSheet,
        fullSheet5 : fullSheet5,
        fullSheet21 : fullSheet21,
        isa : isa,
        matCollection : matCollection
    });

    newMaterial.save(function (err, materials) {
      if (err) {
        console.log("Errors: " + err);
        res.sendStatus(500);
      }
      else {
        // saved!
        console.log("Saved!")
        res.sendStatus(200);
      }
    });
  }
});

router.post('/saveproducts', function(req, res, next) {
  console.log(req.body.product);
  console.log(req.body.action);
  console.log(req.body.parameter);


  if(req.body.action === "update"){
    console.log(req.body.product.distributor);
    console.log(req.body.product.manufacturer);
    console.log(req.body.product.type);
    console.log(req.body.product.price);
    var product = req.body.product;

    var conditions = {distributor: req.body.product.distributor, manufacturer: req.body.product.manufacturer, type: req.body.product.type, description: req.body.product.description}
      , update = {
        itemCode : product.itemCode,
        thickness : product.thickness,
        length : product.length,
        width : product.width,
        fullSheet1 : product.fullSheet1,
        halfSheet : product.halfSheet,
        fullSheet5 : product.fullSheet5,
        fullSheet21 : product.fullSheet21,
        isa : product.isa,
        collection : product.collection,
        formula : product.formula 
      }
      , options = { multi: false};

    mongoose.model('product').update(conditions, update, options, callback);
    function callback (err, numAffected) {
      //numAffected is the number of updated documents
      if(err) {
        console.log("Errors: " + err);
        res.sendStatus(500);
      }
      else {
        console.log("Number of rows Affected: " + numAffected);
          res.sendStatus(200);
      };
    };
  } else if(req.body.action === "delete"){
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.parameter)};
  console.log(query);
    var search = mongoose.model("products").find(query);

    search.remove().exec(function (err, searchProduct){
      if (err) { return next(err); }
      if (!searchProduct) { return next(new Error('can\'t find Product')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });
  } else if(req.body.action === "add"){
    bodyProducts = req.body.product;
    console.log(bodyProducts);

    console.log(bodyProducts.manufacturer);
    //I didn't need to do this part, it's a bit redundant.
    var distributor = bodyProducts.distributor,
      manufacturer = bodyProducts.manufacturer,
      type = bodyProducts.type,
      description = bodyProducts.description,
      itemCode = bodyProducts.itemCode,
      price = bodyProducts.price;

    var newProduct = new products({
      distributor : distributor,
      manufacturer : manufacturer,
      type : type,
      description : description,
      itemCode : itemCode,
      price : price
    });

    newProduct.save(function (err, products) {
      if (err) {
        console.log("Errors: " + err);
        res.sendStatus(500);
      }
      else {
        // saved!
        console.log("Saved!")
        res.sendStatus(200);
      }
    });
  }
});

router.post('/savequote', function(req, res){
  //console.log(req.body.quote);
  console.log("addons", req.body.quote.counters[0].addons[0]);
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