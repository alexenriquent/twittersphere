/** Required dependency */
var twit = require('twit');

/** Twitter client */
var twitter = new twit({
  consumer_key: 'Z5NxW8ZtXTUJGpehf6y4Xpkrr',
  consumer_secret: 'EDCuciugneYkchw5IwvRaxSm0G3kG6bx3AnXybgbXhZZFn8EzY',
  access_token: '40209222-eJyXBmBSw8UAut5sdYM3s9LVEZszX9pw2OBJUfGkG',
  access_token_secret: 'xYrWBDVagelbGv3R7YWOOsHlsvcS9UkIRGh3wTaaWjfwT'
});

/** Export the module */
module.exports = twitter;