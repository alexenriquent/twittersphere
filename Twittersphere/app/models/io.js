/** Required dependency */
var twitter = require('./twitter');

/** Export the module */
module.exports = function(server) {
  /** Initialise socket.io */
  var io = require('socket.io')(server);
  
  /** Searches */
  var searches = {};

  io.on('connection', function(socket) {
    searches[socket.id] = {};
    socket.on('query', function(query) {
      if (!searches[socket.id][query]) {
        console.log('New Search:', query);

        /** Stream with a specified query */
        var stream = twitter.stream('statuses/filter', {
          track: query
        });

        /** Emit a tweet event */
        stream.on('tweet', function(tweet) {
          socket.emit('tweet_' + query, tweet);
        });

        /** Twitter client tries to reconnect in case of connection failure */
        stream.on('reconnect', function(request, response, interval) {
          console.log('reconnect interval:', interval);
        });

        /** Stream limit has reached */
        stream.on('limit', function(message) {
          console.log('Limit on query' + query + 'for user: ' 
            + socket.id + 'has been reached.');
        });

        /** Stream is disconnected */
        stream.on('disconnect', function(message) {
          console.log('disconnect', message);
        });

        /** Save the current query */
        searches[socket.id][query] = stream;
      }
    });
    
    /** Remove event on the socket */
    socket.on('remove', function(query) {
      searches[socket.id][query].stop();
      delete searches[socket.id][query];
      console.log('Remove search:', query);
    });

    /** Disconnect and stop all the streams */
    socket.on('disconnect', function() {
      for (var key in searches[socket.id]) {
        searches[socket.id][key].stop();
        delete searches[socket.id][key];
      }
      delete searches[socket.id];
      console.log('Remove', socket.id);
    });
  });
};