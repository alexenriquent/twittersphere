/** Required dependencies */
var sentiment = require('sentiment');
var training = require('./training');

/** Export the module */
module.exports = function(tweet) {
  return sentiment(tweet, training);
};