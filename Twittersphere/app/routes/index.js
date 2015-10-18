/** Required dependencies */
var express = require('express');
var router = express.Router();

/** GET index.html */
router.get('/', function(req, res) {
  res.render('index', { });
});

/** Redirect all other routes to index.html */
router.get('/*', function(req, res) {
  res.render('index', { });
});

/** Export the module */
module.exports = router;