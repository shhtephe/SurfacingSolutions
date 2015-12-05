(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var express = require('express');
var router = express.Router();
var passport = require('passport');
//mongoose schemas
var account = require('../models/account'); 
var quotes = require('../models/quotes'); 
var customers = require('../models/customers'); 
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
  res.status(500);
  res.render('error', { error: err });
}

//html5 refresh fix
/*router.all("/*", function(req, res, next) {
    res.render("index", { user : req.user });
});*/

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('partials/home', { title: 'Express' });
});

//If route starts with 'customer', this will grab customer data and store it in req.customer, and pass it on to the next function
router.param('customer', function(req, res, next, custCode) {
  var query = {};
      query["custCode"] = custCode;

  var search = mongoose.model('customers').findOne(query);

  search.exec(function (err, customer){
    if (err) { return next(err); }
    if (!customer) { return next(new Error('can\'t find Customer')); }

    req.customer = customer;
    console.log("Param customer");
    console.log(req.customer);
    return next();
  });
});


router.get('/customerdata/:customer', function(req, res, next) {
  req.customer.populate('customers', function(err, customer) {
    if (err) { return next(err); }
    var query = {};
    query["custCode"] = customer.custCode;

    var search = mongoose.model('quote').find(query);

    search.exec(function (err, quotes){
    if (err) { return next(err); }
    if (!quotes) { return next(new Error('can\'t find Quotes')); }
      req.customer = customer;
      console.log(quotes);
      var vm = {
        customer: customer,
        quotes: quotes
      }
      res.json(vm); 
    });
  });
});

router.get('/customer/:customer', function(req, res, next) {
  res.render('partials/customer');
});

/*apparently will save me work, but I don't think it will.
Supposed to run every time there's 'quote' in a url*/
router.param('quotedata', function(req, res, next, quoteID) {
  var query = {};
  query["quoteID"] = quoteID;
  query["custCode"] = req.customer.custCode;

  var search = mongoose.model('quote').find(query);
  search.exec(function (err, quote){
    if (err) {return next(err); }
    if (typeof quote[0]==="undefined") {
      //Instead of just hitting next, create a new quote
      var query = {};
      query["custCode"] = req.customer.custCode;
      search = mongoose.model('quote').findOne().sort({quoteID : "desc"}).exec(function(err, quote){
      
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
          console.log("New quote saved");
          req.quote = quote;
          console.log("Param Quote");
          console.log(req.quote);
          return next();
          };
        });
      });
    } else {
      req.quote = quote;
      console.log("Param Quote");
      console.log(req.quote);
      return next();
    }
  });
});

router.get('/customer/:customer/quotedata/:quotedata', function(req, res, next) {
console.log(req.quote);
  if (typeof req.quote[0]==="undefined") {
      mongoose.model('products').find(function(err, products){
        mongoose.model('materials').find(function(err, materials){
          var vm = { 
            quote: req.quote,
            customer: req.customer,
            products: products,
            materials: materials
          };
          res.json(vm)
        });
    })
  }
  else{
    mongoose.model('products').find(function(err, products){
      mongoose.model('materials').find(function(err, materials){
        var vm = { 
          quote: req.quote[0],
          customer: req.customer,
          products: products,
          materials: materials
        };
        res.json(vm);
      });
    })
  }
});

router.get('/customer/:customer/quote/:quote', function(req, res, next) {
  res.render('partials/quote');
});

router.get('/customer/:customer/quote/:quote/quotefinal', function(req, res, next) {
  res.render('partials/quotefinal');
});

router.get('/customer/:customer/quote/:quote/quotefinaldata', function(req, res, next) {
  console.log(req.quote);
  if (typeof req.quote[0]==="undefined") {
      mongoose.model('products').find(function(err, products){
        mongoose.model('materials').find(function(err, materials){
          console.log(materials);
          res.render('partials/quotefinal', { 
            quote: req.quote,
            customer: req.customer,
            products: products,
            materials: materials
          });
        });
    })
  }
  else{
    mongoose.model('products').find(function(err, products){
      mongoose.model('materials').find(function(err, materials){
        res.render('partials/quotefinal', { 
          quote: req.quote[0],
          customer: req.customer,
          products: products,
          materials: materials
        })
      })
    })
  }
});

router.post('/emailrender', function(req, res) {
  var wkhtmltopdf = require('wkhtmltopdf');
  var fs = require('fs');

  console.log(req.cookies);

  wkhtmltopdf.command = 'C:/wkhtmltopdf/bin/wkhtmltopdf.exe';

  pageURL = "http://" + req.hostname + ":3000" + req.body.data.url;
  console.log(pageURL);

wkhtmltopdf( pageURL, { 
    pageSize: 'letter',  
    'window-status': 'ready',
    
  })
  .pipe(fs.createWriteStream('out.pdf'))
    .on('error', function( err ){ throw err })
    .on('finish', function(){
      console.log("Success");
      res.sendStatus(200);
    });



  /*var userID = req.body.data.userID;
  var quoteID = req.body.data.quoteID;
  
  // get url to process
  var url_to_process = "/#/customer/" + userID + "/quote/" + quoteID + "/quotefinal";

  if (userID === undefined || userID == '' || quoteID === undefined || quoteID == '') {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404 Not Found");
  };

  // phantomjs screenshot
  var phantom = require('phantom');
  console.log('Var created');
  phantom.create(function(ph){
    console.log('Phantom.create initialised');
    ph.createPage(function(page){
      console.log('ph.createpage initialised'); 
      page.open(url_to_process, function(status){
        console.log('page.open initialised');
        if (status == "success") {
          // put images in public directory
          var image_file_name = url_to_process.replace(/\W/g, '_') + ".png"
          var image_path = public_dir + "/" + image_file_name
          page.render(image_path, function(){
            // redirect to static image
            res.redirect('/'+image_file_name);
          });
        }
        else {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end("404 Not Found");
        };
        page.close();
        ph.exit();
      });
    });
  });
*/
  /*
  var done = false; //flag that tells us if we're done rendering
  var userID = req.body.data.userID;
  var quoteID = req.body.data.quoteID;
  var page = require('webpage').create();
  page.open('http://google.com', function (status) {
      //If the page loaded successfully...
      if(status === "success") {
          //Render the page
          page.render('google.pdf');
          console.log("Site rendered...");

          //Set the flag to true
          done = true;
      } else {
        console.log('Site did not render');
      };
  });

  //Start polling every 100ms to see if we are done
  var intervalId = setInterval(function() {
      if(done) {
          //If we are done, let's say so and exit.
          console.log("Done.");
          phantom.exit();
          res.sendStatus(200);
      } else {
          //If we're not done we're just going to say that we're polling
          console.log("Polling...");
      }
  }, 100);
*/
});

router.get('/admindata', function(req, res, next) {
  mongoose.model('products').find(function(err, products){
    mongoose.model('materials').find(function(err, materials){
      var vm = { 
        products: products,
        materials: materials
      };
      res.json(vm);
    });
  });
});

router.get('/admin', function(req, res, next) {
  res.render('partials/admin');
});

router.post('/savematerials', function(req, res, next) {
  console.log('Material',req.body.material);
  //console.log(req.body.action);
  //console.log(req.body.parameter);


  if(req.body.action === "update"){
    /*console.log(req.body.material.distributor);
    console.log(req.body.material.manufacturer);
    console.log(req.body.material.colourGroup);*/
    var material = req.body.material;
    console.log("Mat Colleciton", material.matCollection);

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
        matCollection : material.matCollection
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
    console.log("Parameter:", req.body.parameter);
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.parameter)};
  console.log('Query', query);
    var search = mongoose.model('materials').find(query);

    search.remove().exec(function (err, searchMaterial){
      if (err) { return next(err); }
      if (!searchMaterial) { return next(new Error('can\'t find Material')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });
  } else if(req.body.action === "add"){
    bodyMaterials = req.body.parameter;
    console.log('Body Materials', bodyMaterials);

    console.log('Manufaturer', bodyMaterials.manufacturer);
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
  //console.log(req.body.product);
  console.log("Action: ", req.body.action);
  //console.log(req.body.parameter);


  if(req.body.action === "update"){
    //console.log(req.body.product.distributor);
    //console.log(req.body.product.manufacturer);
    //console.log(req.body.product.type);
    console.log("Product: ", req.body.product);
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
        matCollection : product.matCollection,
        formula : product.formula,
        price: product.price
      }
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
          res.sendStatus(200);
      };
    };
  } else if(req.body.action === "delete"){
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { _id: new ObjectId(req.body.parameter)};
  console.log("Query ", query);
    var search = mongoose.model('products').find(query);

    search.remove().exec(function (err, searchProduct){
      if (err) { return next(err); }
      if (!searchProduct) { return next(new Error('can\'t find Product')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });
  } else if(req.body.action === "add"){
    bodyProducts = req.body.parameter;
    console.log("Body Products: ", bodyProducts);

    console.log("Manufacturer: ", bodyProducts.manufacturer);
    //I didn't need to do this part, it's a bit redundant.
    var distributor = bodyProducts.distributor,
      manufacturer = bodyProducts.manufacturer,
      type = bodyProducts.type,
      description = bodyProducts.description,
      itemCode = bodyProducts.itemCode,
      price = bodyProducts.price,
      formula = bodyProducts.formula;

    var newProduct = new products({
      distributor : distributor,
      manufacturer : manufacturer,
      type : type,
      description : description,
      itemCode : itemCode,
      price : price,
      formula: formula
    });
console.log("New Product: ", newProduct);
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
  //console.log(req.body.quote.counters[0].material);
  //console.log("addons", req.body.quote.counters[0].addons[0]);
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
      res.render('partials/customers');
});

router.get('/customersdata', function(req, res, next) {
  mongoose.model('customers').find(function(err, data) {
      res.json(data);
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