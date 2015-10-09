/** Required dependency */
var sentiment = require('sentiment');

/** Export the module */
module.exports = function(tweet) {
  return sentiment(tweet);
};