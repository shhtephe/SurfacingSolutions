var express = require('express');
var router = express.Router();
var passport = require('passport');
var customerService = require('../services/customer-service');

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

router.post('/create', function(req, res, next) {
  console.log("Customer post worked");
  customerService.createCustomer(req.body, function(err){
    if (err) {
      var vm = {
        title: 'Create a New User',
        input: req.body,
        error: 'Something went wrong'
      };
      return res.render('partials/customers/create', vm);
    };
    res.json(vm);
  }); 
});

module.exports = router;