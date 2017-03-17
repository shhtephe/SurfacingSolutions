var express = require('express');
var router = express.Router();
var passport = require('passport');
var customerService = require('../services/customer-service');

// GET /customer/create
router.get('/create', function(req, res, next) {
  var vm = {
    title:'Add a customer'
  };
  res.render('partials/customers/create', vm);
});

router.post('/create', function(req, res, next) {
  customerService.createCustomer(req.body, function(err){
    if (err) {
      var vm = {
        title: 'Create a New User',
        input: req.body,
        error: 'Something went wrong: ' + err
      };
    } else {
      var vm = {
        title: 'Create a New User',
        input: req.body
      }
    };
    return res.json(vm);
  });
});

module.exports = router;