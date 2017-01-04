var express = require('express');
var router = express.Router();
var passport = require('passport');
//mongoose schemas
var account = require('../models/account'); 
var quotes = require('../models/quotes'); 
var customers = require('../models/customers'); 
var products = require('../models/products'); 
var materials = require('../models/materials');
var terms = require('../models/terms');

//mongoose
var mongoose = require('mongoose');

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
  console.log("Rendering Homepage");
  res.render('partials/home', { title: 'Express' });
});

//If route starts with 'customer', this will grab customer data and store it in req.customer, and pass it on to the next function
router.param('customer', function(req, res, next, custCode) {
  console.log("Fetching Customer Data");
  var query = {};
      query["custCode"] = custCode;

  var search = mongoose.model('customers').findOne(query);

  search.exec(function (err, customer){
    if (err) { return next(err); }
    if (!customer) { return next(new Error('can\'t find Customer')); }

    req.customer = customer;
    console.log("Param customer", req.customer);
    return next();
  });
});

//Gets individual quotes for customer
router.get('/customerdata/:customer', function(req, res, next) {
  console.log("Loading Customer Quotes");
  req.customer.populate('customers', function(err, customer) {
    if (err) { return next(err); }
    var query = {};
    query["custCode"] = customer.custCode;

    var search = mongoose.model('quote').find(query);

    search.exec(function (err, quotes){
    if (err) { return next(err); }
    if (!quotes) { return next(new Error('can\'t find Quotes')); }
      req.customer = customer;
      //console.log(quotes);
      var vm = {
        customer: customer,
        quotes: quotes
      }
      res.json(vm); 
    });
  });
});

//Render's Customer page
router.get('/customer/:customer', function(req, res, next) {
  console.log("Rendering Customer page");
  res.render('partials/customer');
});

router.post('/removeQuote', function(req, res, next){
  console.log("Deleting customer " + req.body.customer.custCode + "'s quote number " + req.body.quote.quoteID);
  var ObjectId = require('mongoose').Types.ObjectId; 
    var query = {  
      custCode : req.body.customer.custCode,
      quoteID : req.body.quote.quoteID
    };
    var search = mongoose.model('quote').find(query);
    search.remove().exec(function (err, searchQuote){
      if (err) { return next(err); }
      if (!searchQuote) { return next(new Error('Can\'t find Quote.')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });

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
    //console.log("Quote 0: ", typeof quote[0] === "undefined");
    if (typeof quote[0]==="undefined") {
      //Instead of just hitting next, create a new quote
      var query = {};
      query["custCode"] = req.customer.custCode;
      search = mongoose.model('quote').findOne().sort({quoteID : "desc"}).exec(function(err, quote){
        var quoteID 
        console.log("Quote: ", quote);
        if(quote == null){
          quoteID = 1;  
        }
        else {
          quoteID = quote.quoteID + 1
        };
        var custCode = req.customer.custCode,
        totalPrice = 0,
        jobDifficulty = 0,
        counters = [];

        console.log("quote ID!", quoteID);

        var newQuote = new quotes({
          quoteID: quoteID,
          custCode: custCode,
          totalPrice: totalPrice,
          jobDifficulty: 1,
          counterGroup: []
        });

        newQuote.save(function (err, quote) {
          if (err) {return errorHandler(err);}
          else {
            // saved!
            console.log("New quote saved");
            req.quote = quote;
            //console.log("Param Quote");
            //console.log(req.quote);
            return next();
          };
        });
      });
    } else {
      req.quote = quote;
      //console.log("Param Quote");
      //console.log(req.quote);
      return next();
    }
  });
});

router.get('/customer/:customer/quotedata/:quotedata', function(req, res, next) {
//console.log(req.quote);
  if (typeof req.quote[0]==="undefined") {
      mongoose.model('products').find(function(err, products){
        mongoose.model('materials').find(function(err, materials){
          mongoose.model('terms').find(function(err, terms){
            var vm = { 
              quote: req.quote,
              customer: req.customer,
              products: products,
              materials: materials,
              terms: terms
            };
            res.json(vm)
          });
        });
    })
  }
  else{
    mongoose.model('products').find(function(err, products){
      mongoose.model('materials').find(function(err, materials){
        mongoose.model('terms').find(function(err, terms){
          var vm = { 
            quote: req.quote[0],
            customer: req.customer,
            products: products,
            materials: materials,
            terms: terms
          };
          res.json(vm);
        });
      });
    })
  }
});

router.get('/customer/:customer/quotebuild/:quote', function(req, res, next) {
  res.render('partials/quotebuild');
});

router.get('/customer/:customer/quotebuild/:quote/quotefinal', function(req, res, next) {
  res.render('partials/quotefinal');
});

router.get('/customer/:customer/quotebuild/:quote/quotesend', function(req, res, next) {
  res.render('partials/quotesend');
});

router.get('/customer/:customer/quotebuild/:quote/quotefinaldata', function(req, res, next) {
  //console.log(req.quote);
  if (typeof req.quote[0]==="undefined") {
      mongoose.model('products').find(function(err, products){
        mongoose.model('materials').find(function(err, materials){
          //console.log(materials);
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

renderNightmare = function(req, res) {
  //Nightmare Wrapper 
  console.log("Declaring Nightmare");
  var nightmare = require('nightmare');

  var public_dir = '.\\public\\images\\emailquote';

  var pageURL = "http://" + req.hostname + ":8080" + req.body.data.url;
  //var pageURL = "http://google.com";
  console.log("PageURL: ",pageURL);
  console.log("public_dir: ", public_dir);
  //Create new nightmare ;)
  var screenshot = new nightmare()
  .goto(pageURL)
  .wait(5000)
  .pdf(public_dir + '/testfile.pdf') //Should name this file properly in case it isn't deleted
  .run(function(err, nightmare) {
    console.log("Running Nightmare");
    if (err){
      return console.log("Screenshot error:", err);
    } 
    else {
      console.log('Screenshot Successful!');
      //Email PDF as attachment
      var fs = require('fs');
      var path = require('path'),
      attachFileName = "testfile.pdf",
      attachFilePath = path.join(public_dir, attachFileName),
      pdf = fs.readFileSync(attachFilePath);

      var gutil = require('gulp-util'); //For Colour text in terminal
      var nodemailer = require("nodemailer");
      var transporter = nodemailer.createTransport('smtps://pete%40surfacingsolutions.ca:Soccerball11@surfacing.dmtel.ca');

      console.log("Customer Data: ", req.body.data.cust);
      //Email body
      var body = req.body.data.customer.firstName + ", please find attached our quote for services based on the information you provided. If you have any questions please call our office and speak to your sales person.<br><br>Thank you for the opportunity and we look forward to working with you.<br><br>" + req.body.data.salesPerson.firstName + " " + req.body.data.salesPerson.lastName + "<br> Surfacing Solutions (2010) Limited<br>e: " + req.body.data.salesPerson.email + " t: " + req.body.data.salesPerson.phoneNumber;
      
      //Set email options up
      var mailOptions = {
          from: "pete@surfacingsolutions.ca", // sender address
          to:  req.body.data.email, // list of receivers
          cc: "quotes@surfacingsolutions.ca",
          subject: "Surfacing Solutions Quote", // Subject line
          html: body, // html body
          attachments: [{
            filename: attachFileName,
            path: attachFilePath
            //contentType: 'application/pdf'
          }]
      };
      transporter.sendMail(mailOptions, function(error, response){
        if (error) {
          console.log('Sending Mail Failed!', error);
          res.sendStatus(500);
          return;
        } else {
          console.log("Emailed", response);
          res.header('Content-Type', 'text/plain');
          res.sendStatus(200);
        };
        //Delete file once we're done.
        fs.exists(attachFilePath, function(exists) {
          if(exists) {
            //Show in green
            console.log(gutil.colors.green('Deleting Temp File'));
            fs.unlink(attachFilePath);
          } else {
            //Show in red
            console.log(gutil.colors.red('File not found.'));
          };
        });
        // if you don't want to use this transport object anymore, uncomment following line
        transporter.close(); // shut down the connection pool, no more messages
      });
    };
  }).catch(function(err){
    console.log(err);
    nightmare.end();
  });
};


router.post('/emailrender', function(req, res) {
  console.log("Email Render is running.");

  var env = process.env.NODE_ENV;
  console.log("Env Variable: ", env);

  //Use screen emulator if in linux environment
  if(env === 'production'){
    //var Xvfb = require('xvfb');
    //var xvfb = new Xvfb();
    //This creates an emulated screen for nightmare to work in
    var headless = require('headless');
    console.log("Starting sync");
    headless(function(err, childProcess, servernum) {
      console.log('Xvfb running on server number', servernum);
      console.log('Xvfb pid', childProcess.pid);
      console.log('err should be null', err);
      if(err){
        console.log("There was an error: ", err);
      };
      renderNightmare(req, res);
    });
    /*xvfb.start(function(err, xvfbProcess) {
      renderNightmare(req, res);
      xvfb.stop(function(err) {
        // the Xvfb is stopped 
      });
    });*/
    
  } else {
    renderNightmare(req, res);
  };
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
  console.log(req.body.action + ' materials Ran')
  //console.log('Material: ',req.body.material);
  //console.log(req.body.action);
  //console.log(req.body.parameter);

  if(req.body.action === "update"){
    /*console.log(req.body.material.distributor);
    console.log(req.body.material.manufacturer);
    console.log(req.body.material.colourGroup);
    console.log("Mat Colleciton", material.matCollection);*/
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
    //console.log("Parameter:", req.body.parameter);
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = req.body.parameter;
    //console.log('Query', query);
    var search = mongoose.model('materials').find(query);
    search.remove().exec(function (err, searchMaterial){
      if (err) { return next(err); }
      if (!searchMaterial) { return next(new Error('Can\'t find material.')); }
      console.log("Entry Deleted");
      res.sendStatus(200);
    });
  } else if(req.body.action === "add"){
    bodyMaterials = req.body.parameter;
    //console.log('Body Materials', bodyMaterials);

    //console.log('Manufaturer', bodyMaterials.manufacturer);
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
        console.log("Material did not save: " + err);
        res.sendStatus(500);
      }
      else {
        // saved!
        console.log("Material saved!")
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

    //I didn't need to do this part, it's a bit redundant.
    var distributor = bodyProducts.distributor,
      manufacturer = bodyProducts.manufacturer,
      productType = bodyProducts.productType,
      description = bodyProducts.description,
      itemCode = bodyProducts.itemCode,
      price = bodyProducts.price,
      formula = bodyProducts.formula,
      mandatory = bodyProducts.mandatory,
      nonMandatory = bodyProducts.nonMandatory;

    var newProduct = new products({
      distributor : distributor,
      manufacturer : manufacturer,
      productType : productType,
      description : description,
      itemCode : itemCode,
      price : price,
      formula : formula,
      mandatory : mandatory,
      nonMandatory : nonMandatory
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
  //console.log(req.body.quote.counterGroup[0].addons[0]);
  //console.log("addons", req.body.quote.counters[0].addons[0]);
  var conditions = {quoteID: req.body.quote.quoteID, custCode: req.body.quote.custCode}
  , update = req.body.quote
  , options = { multi: false, upsert: true};

  mongoose.model('quote').update(conditions, update, options, callback);
  function callback (err, numAffected) {
    //numAffected is the number of updated documents
    if(err) {
      console.log("Errors: " + err);
      res.sendStatus(500);
    }
    else {
      console.log("Quote Saved! Rows affected: ", numAffected);
      res.sendStatus(200); 
    }
  }
});

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
  console.log(req.body.data)
    account.register(new account(
        { 
          username : req.body.data.username, 
          accountType : req.body.data.accountType, 
          email : req.body.data.email, 
          phoneNumber : req.body.data.phoneNumber
        }), req.body.data.password, function(err, account) {
        if (err) {
          console.log("Error", err);
          res.status(500).send({info: "Sorry there was an error", error : err.message});
        }
        else {
          res.sendStatus(200)
        };
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