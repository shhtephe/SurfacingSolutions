var express = require('express');
var router = express.Router();
var passport = require('passport');
//mongoose schemas
var account = require('../models/account'); 
var quotes = require('../models/quotes'); 
var customers = require('../models/customers'); 
var products = require('../models/products'); 
var materials = require('../models/materials');
var remnants = require('../models/remnants');
var remnantsIndex = require('../models/remnantsIndex');
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
    //console.log("Customer Data: ", req.customer);
    return next();
  });
});

//Gets individual quotes for customer
router.get('/customerdata/:customer', function(req, res, next) {
  console.log("Fecthing Customer Quotes");
  //console.log(req.customer);
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

//Creating a new quote:
router.post('/newquote', function(req, res, next) {
  console.log(req.body);
  createNewQuote(res, req.body.customer, req.body.copyQuote, req.body.quote);
});

/*This runs when grabbing the quote*/
router.param('quotedata', function(req, res, next, quoteID) {
  console.log("Fetching Customer Quote " + quoteID);
  //Creates quote query
  var query = {};
  query["quoteID"] = quoteID;
  query["custCode"] = req.customer.custCode;

  //Searches for quote
  var search = mongoose.model('quote').find(query);
  search.exec(function (err, quote){
    if (err) {return next(err); }
      //console.log("Quote 0: ", typeof quote[0] === "undefined");
      req.quote = quote;
      return next();
  });
});

createNewQuote = function(res, customer, copyQuote, quote) {
    var search = mongoose.model('quote').findOne().sort({quoteID : "desc"}).exec(function(err, searchQuote){
      var quoteID;
      console.log("Quote: ", searchQuote);
      //Search for highest quote number and increment that by one
      if(searchQuote == null){
        quoteID = 1;  
      }
      else {
        quoteID = searchQuote.quoteID + 1
      };
     
      console.log("quote ID!", quoteID);
      console.log(typeof copyQuote, copyQuote);
      //console.log(quote);

      if (copyQuote === "False") {
        //set values for new quote
        var newQuote = new quotes({
          quoteID: quoteID,
          custCode: customer.custCode,
          totalPrice: 0,
          jobDifficulty: 1,
          counterGroup: [],
          showGCPSF: false
        });
      } else if(copyQuote === "True") {
        //replace current quoteID, replace customer and remove metadata
        delete quote._id;
        delete quote.createdAt;
        delete quote.updatedAt;
        quote.quoteID = quoteID;
        quote.custCode = customer.custCode;
        console.log("Modified Quote:", quote);

        var newQuote = new quotes(quote);
      } else {
        res.sendStatus(500);
      };
      newQuote.save(function (err, quote) {
        if (err) {console.log("Error:", err); return errorHandler(err);}
        else {
          // saved!
          console.log("New quote saved");
          res.json(quote);  
      };
    });
  });
};
router.get('/customer/:customer/quotedata/:quotedata', function(req, res, next) {
console.log("Returning Quote")
  if (typeof req.quote[0]==="undefined") {
      createNewQuote(req.params.customer, res);
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
    });
  };
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

renderNightmare = function(req, res, env) {
  //Nightmare Wrapper 
  console.log("Declaring Nightmare");
  var nightmare = require('nightmare');

  var public_dir = '.\\public\\images\\emailquote\\';
  var PDFName = req.body.data.quoteID + ' - ' + req.body.data.createdAt + '.pdf';
  if (env == "production") {
    //var pageURL = "http://" + req.hostname + ":8080" + req.body.data.url;
    pageURL = "http://localhost:8080" + req.body.data.url;
  } else if (env == "dev") {
    var pageURL = "http://" + req.hostname + ":8081" + req.body.data.url;
  };

  console.log("PageURL: ",pageURL);
  console.log("public_dir: ", public_dir);
  //Create new nightmare ;)
  var screenshot = new nightmare()
  .goto(pageURL)
  .wait(9000)
  .pdf(public_dir + PDFName)
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
      attachFileName = PDFName,
      attachFilePath = path.join(public_dir, attachFileName),
      pdf = fs.readFileSync(attachFilePath);

      var gutil = require('gulp-util'); //For Colour text in terminal
      var nodemailer = require("nodemailer");

      /*App stopped working after several years of use. Trying to use an object instead of a URL*/
      //var transporter = nodemailer.createTransport('smtps://info%40surfacingsolutions.ca:10Counter11@smtp-relay.gmail.com');
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: "info@surfacingsolutions.ca",
          pass: "10Counter11"
        }
      });
      //console.log("Customer Data: ", req.body.data.cust);
      //Email body
      var body = req.body.data.emailBody;
      console.log(req.body.data);
      if(req.body.data.description){
        var emailSubject = "Surfacing Solutions Quote " + req.body.data.quoteID + " - " + req.body.data.description; 
      }
      else {
        var emailSubject = "Surfacing Solutions Quote " + req.body.data.quoteID;
      };
      //Set email options up
      if(req.body.data.account.email && req.body.data.email) {
        var mailOptions = {
          from: req.body.data.account.email, // sender address
          to:  req.body.data.email, // list of receivers
          cc: ["info@surfacingsolutions.ca", req.body.data.account.email],
          subject: emailSubject, // Subject line
          html: body, // html body
          attachments: [{
            filename: attachFileName,
            path: attachFilePath
            //contentType: 'application/pdf'
          }]
        };
        console.log("Mail Options: ", mailOptions);
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
      } else {
        console.log("Account email or email missing.");
        console.log(req.body.data.account.email, req.body.data.email);
        console.log(req.body.data);
      };
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
  renderNightmare(req, res, env);
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

router.get('/accountdata', function(req, res, next) {
  mongoose.model('accounts').find(function(err, accounts){
    var vm = { 
      accounts : accounts
    };
    res.json(vm);
  });
});

router.get('/quotesdata', function(req, res, next) {
  mongoose.model('quote').find(function(err, quote){
    var vm = { 
      quotes : quote
    };
    res.json(vm);
  });
});


router.get('/pricing', function(req, res, next) {
  res.render('partials/pricing');
});

router.get('/useradmin', function(req, res, next) {
  res.render('partials/useradmin');
});

router.get('/remnants', function(req, res, next) {
  res.render('partials/remnants');
});

router.get('/remnantsview', function(req, res, next) {
  res.render('partials/remnantsview');
});

//This needs to be edited
router.post('/saveaccount', function(req, res, next) {
  console.log(req.body.account)
  if(req.body.action === "update"){
    var account = req.body.account;
    var conditions = {_id:account._id}
      , update = {
          firstName: account.firstName,
          lastName: account.lastName,
          username: account.username,
          accountType: account.accountType,
          email: account.email,
          phoneNumber: account.phoneNumber
        }
      , options = { multi: false};
    console.log("conditions", conditions);
    mongoose.model('accounts').update(conditions, update, options, callback);
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
  } else if(req.body.action === "remove"){
    //console.log("body:", req.body);
    var ObjectId = require('mongoose').Types.ObjectId;
    var query = req.body.account;
    console.log('Query', query);
    var search = mongoose.model('accounts').find(query);
    search.remove().exec(function (err, searchAccounts){
      if (err) { return next(err); }
      if (!searchAccounts) { console.log("Can't find account"); } 
      else {      
        console.log("Entry Deleted");
        res.sendStatus(200);
      };
    });
  } else if(req.body.action === "password") {
    var username = req.body.account.username,
        newPasswordString = req.body.account.password;
    console.log("Finding by username");
    var search = mongoose.model('accounts').findByUsername(username);
    search.exec(function(err, sanitizedUser){
      if (err) {console.log("There was an error: ", err)};
      if (sanitizedUser){
          sanitizedUser.setPassword(newPasswordString, function(){
              sanitizedUser.save();
              console.log("Password reset successful")
              res.status(200).json({message: 'password reset successful'});
          });
      } else {
        console.log("User not found")
          res.status(500).json({message: 'This user does not exist'});
      };
    });
    
  };
});

router.post('/updatedb', function(req, res, next) {
  //console.log(req.body.json.data);
  var conditions = {};
  mongoose.model(req.body.dataBase).find(conditions).remove(callback);
  function callback (err, numAffected) {
    if(err) {
      console.log("Errors: " + err);
      res.sendStatus(500);
    } else {
      console.log("Number of rows Dropped: " + numAffected);
      if(req.body.dataBase == 'materials') {
        materials.create(req.body.json.data, function (err, material) {
          if (err) {
            console.log("Errors: " + err);
            res.sendStatus(500);
          } else {
            console.log(req.body.dataBase + " database has been updated");
            res.sendStatus(200);
          };
        });
      } else if (req.body.dataBase == 'products') {
        products.create(req.body.json.data, function (err, product) {
          if (err) {
            console.log("Errors: " + err);
            res.sendStatus(500);
          } else {
            console.log(req.body.dataBase + " database has been updated");
            res.sendStatus(200);
          };
        });
      } else if (req.body.dataBase == 'remnantsIndex') {
        remnantsIndex.create(req.body.json.data, function (err, remnantsIndex) {
          if (err) {
            console.log("Errors: " + err);
            res.sendStatus(500);
          } else {
            console.log(req.body.dataBase + " database has been updated");
            res.sendStatus(200);
          };
        });
      };
    };
  };
});

router.post('/updateremnants', function(req, res, next) {
  console.log(req.body);
  if(req.body.action === "update"){
    var remnant = req.body.data;
    var conditions = {_id:remnant._id}
      , update = {
        length: req.body.data.length,
        width: req.body.data.width,
        location: req.body.data.location,
        hold: req.body.data.hold
      }
      , options = { multi: false};
    console.log(conditions);
    mongoose.model('remnants').update(conditions, update, options, callback);
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
  } else if(req.body.action === "remove"){
    //console.log("Parameter:", req.body.parameter);
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = req.body.data;
    //console.log('Query', query);
    var search = mongoose.model('remnants').find(query);
    search.remove().exec(function (err, searchRemnants){
      if (err) { return next(err); }
      if (!searchRemnants) { return next(new Error('Can\'t find remnant.')); } 
      else {      
        console.log("Entry Deleted");
        res.sendStatus(200);
      };
    });
  } else if(req.body.action === "add"){
    var search = mongoose.model('remnants').findOne().sort({remnantID : "desc"}).exec(function(err, remnant){
      var remnantID;
      console.log("Remnant: ", remnant);
      //Search for highest quote number and increment that by one
      if(remnant == null){
        remnantID = 1001;  
      }
      else {
        remnantID = remnant.remnantID + 1
      };

      console.log("Found remnantID", remnantID);
      console.log("Adding remnant");
      console.log(req.body.data)
      var newRemnant = new remnants({
        manufacturer: req.body.data.manufacturer,
        remnantType: req.body.data.remnantType,
        colourGroup: req.body.data.colourGroup,
        description: req.body.data.description,
        thickness: req.body.data.thickness,
        length: req.body.data.length,
        width: req.body.data.width,
        location: req.body.data.location,
        hold: req.body.data.hold,
        remnantID: remnantID
      });
      console.log("New Remnant", newRemnant);
      newRemnant.save(function (err, numAffected) {
        if (err) {
          console.log("Remnant did not save: " + err);
          res.sendStatus(500);
        }
        else {
          //saved!
          console.log("Remnant saved!", numAffected);
          res.sendStatus(200);
        }
      });
    });
  };
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

router.post('/savecustomer', function(req, res){
  //console.log("Customer", req.body.customer);
  var conditions = {custCode:req.body.customer.custCode}
    , update = req.body.customer
    , options = {upsert: true};
  if(req.body.action == 'replace') {
    console.log("Finding and removing")
    mongoose.model('customers').findOneAndRemove(conditions, callback);
    function callback (err, doc) {
      if(err) {
        console.log("Could not Remove: " + err);
        res.sendStatus(500);
      } else {
        if(update.__v) {
          console.log("Removing __v");
          delete update._v;
        };
        console.log("Updating with new doc")
        mongoose.model('customers').findOneAndUpdate(conditions, update, options, callback);
        function callback (err, doc) {
          if(err) {
            console.log("Errors: " + err);
            res.sendStatus(500);
          } else {
            console.log("Customer Saved! Rows affected: ", doc);
            res.sendStatus(200); 
          };
        };
      };
    };
  } else if (req.body.action == 'update') {
      if(typeof update.__v == 'number') {
        console.log("Removing __v");
        delete update.__v;
      };
      console.log(conditions, update, options);
      mongoose.model('customers').findOneAndUpdate(conditions, update, options, callback);
      function callback (err, doc) {
      if(err) {
        console.log("Could not update doc: " + err);
        res.sendStatus(500);
      } else {
        console.log("Customer Saved! Rows affected: ", doc);
        res.sendStatus(200); 
      };
    };
  };
});

router.post('/deletecustomer', function(req, res){
  var conditions = {custCode:req.body.custCode};
  mongoose.model('customers').find(conditions).remove(callback);
  function callback (err) {
    if (err) {
      console.log("Could not delete customer: " + err);
      res.sendStatus(500);
    } else {
      console.log("Customer deleted");
      res.sendStatus(200);
    };
  }
});


router.post('/savequote', function(req, res){
  console.log(req.body.quote);
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
    };
  };
});

router.get('/customers', function(req, res, next) {
      res.render('partials/customers');
});

router.get('/customersadmin', function(req, res, next) {
      res.render('partials/customersadmin');
});

router.get('/customersdata', function(req, res, next) {
  mongoose.model('customers').find(function(err, data) {
      res.json(data); 
  }); 
});

router.get('/remnantsdata', function(req, res, next) {
  var data = {};
  mongoose.model('remnants').find(function(err, remnants) {
    console.log("remnants", remnants)
    if (err) {
      res.status(500).send({info: "Sorry there was an error", error : err.message});
    };
    mongoose.model('remnantsIndex').find(function(err, remnantsIndex) {
      if (err) {
        res.status(500).send({info: "Sorry there was an error", error : err.message});
      };
      data = {
        remnantsIndex:remnantsIndex,
        remnants:remnants
      };
      res.json(data);
    });
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
          firstName : req.body.data.firstName,  
          lastName : req.body.data.lastName,  
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