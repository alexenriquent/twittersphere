/** Required dependencies */
var http = require('http');
var express = require('express');
var app = express();
var server = http.Server(app);
var path = require('path');
var io = require('socket.io')(server);
var twit = require('twit');

/** Identify port from environment */
var port = process.env.PORT || 8080;

/** Searches */
var searches = {};

/** Twitter client */
var twitter = new twit({
  consumer_key: 'Z5NxW8ZtXTUJGpehf6y4Xpkrr',
  consumer_secret: 'EDCuciugneYkchw5IwvRaxSm0G3kG6bx3AnXybgbXhZZFn8EzY',
  access_token: '40209222-eJyXBmBSw8UAut5sdYM3s9LVEZszX9pw2OBJUfGkG',
  access_token_secret: 'xYrWBDVagelbGv3R7YWOOsHlsvcS9UkIRGh3wTaaWjfwT'
});

/** Add connection to the public folder */
app.use(express.static(path.join(__dirname, 'public')));

/** Static route to the main page */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

/** Configure socket to start listening for an incomming connection */
io.on('connection', function(socket) {
  searches[socket.id] = {};
  socket.on('q', function(q) {
    if (!searches[socket.id][q]) {
      console.log('New Search:', q);

      var stream = twitter.stream('statuses/filter', {
        track: q
      });

      /** Emit a tweet event */
      stream.on('tweet', function(tweet) {
        socket.emit('tweet_' + q, tweet);
      });

      /** Stream limit has reached */
      stream.on('limit', function(limitMessage) {
        console.log('Limit on query' + q + 'for user: ' 
          + socket.id + 'has been reached.');
      });

      /** Warnings on the stream */
      stream.on('warning', function(warning) {
        console.log('warning', warning);
      });

      /** Twitter client tries to reconnect in case of connection failure */
      stream.on('reconnect', function(request, response, connectInterval) {
        console.log('reconnect :: connectInterval', connectInterval);
      });

      /** Stream is disconnected */
      stream.on('disconnect', function(disconnectMessage) {
        console.log('disconnect', disconnectMessage);
      });

      /** Save the current query */
      searches[socket.id][q] = stream;
    }
  });
  
  /** Remove event on the socket */
  socket.on('remove', function(q) {
    searches[socket.id][q].stop();
    delete searches[socket.id][q];
    console.log('Remove search:', q);
  });

  /** Disconnect and stop all the streams */
  socket.on('disconnect', function() {
    for (var key in searches[socket.id]) {
      searches[socket.id][key].stop();
      delete searches[socket.id][key];
    }
    delete searches[socket.id];
    console.log('Remove all searches from user:', socket.id);
  });
});

/** Listen on the specified port and log a message to the console */
server.listen(port);
console.log('Server listening on port ' + port);
