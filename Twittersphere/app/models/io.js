/** Required dependencies */
var io = require('socket.io')
var twitter = require('./twitter');
var sentiment = require('./sentiment');
var db = require('diskdb');

db = db.connect('app/db', ['tweets', 'sentiments']);

/** Export the module */
module.exports = function(server) {
  /** Initialise socket.io */
  io = io(server);
  
  /** Searches */
  var searches = {};

  io.on('connection', function(socket) {
    /** Tweet counter */
    var tweetCount = 0;
    searches[socket.id] = {};
    socket.on('query', function(query) {
      if (!searches[socket.id][query]) {
        console.log('Search:', query);

        /** Stream with a specified query */
        var stream = twitter.stream('statuses/filter', {
          track: query
        });
    
        /** Emit a tweet event */
        stream.on('tweet', function(tweet) {
          if (tweet.lang === 'en') {
            var result = sentiment(tweet.text);
            var tweetData = {
              socket: socket.id,
              tweetNum: tweetCount + 1,
              text: tweet.text,
              sentiment: {
                score: result.score,
                comparative: result.comparative,
                words: result.words,
                positive: result.positive,
                negative: result.negative
              }
            };

            db.tweets.save(tweetData);
            socket.emit('tweet_' + query, tweet);

            var meanScore = 0;
            var meanComparative = 0;
            var tweets = db.tweets.find({socket: socket.id});

            for (var i = 0; i < tweets.length; i++) {
              meanScore = meanScore + tweets[i].sentiment.score;
              meanComparative = meanComparative 
                + tweets[i].sentiment.comparative;
            }

            tweetCount++;
            meanScore /= tweetCount;
            meanComparative /= tweetCount;

            var sentimentData = {
              socket: socket.id,
              tweetNum: tweetCount,
              score: meanScore,
              comparative: meanComparative
            };

            db.sentiments.save(sentimentData);

            var resultLength = db.sentiments.find({socket: socket.id}).length;
            var resultData = db.sentiments.find({socket: socket.id})[resultLength - 1];
            socket.emit('analysis', resultData);
          }
        });

        /** Twitter client tries to reconnect in case of connection failure */
        stream.on('reconnect', function(request, response, interval) {
          console.log('reconnect interval:', interval);
        });

        /** Stream limit has reached */
        stream.on('limit', function(message) {
          console.log('Limit for ' + socket.id + ' has been reached.');
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
      console.log('Number of Tweets:', tweetCount);
      console.log('Remove', socket.id);
      tweetCount = 0;
    });
  });
};