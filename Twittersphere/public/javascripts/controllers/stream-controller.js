/** Controller for streaming inflow Twitter messages */
app.controller('StreamCtrl', ['$scope', 'socket', function($scope, socket) {
  $scope.collections = [];
  $scope.index = 0;

  $scope.submit = function($event) {
    var numEvents = 13;
    if ($event.which !== numEvents) {
      return;
    }
    if ($scope.hashtags) {
      $scope.add($scope.hashtags);
    }
    
  };

  $scope.add = function(query) {
    var collections = $scope.collections;
    var style = 'collection';
    var collection = {
      title: query,
      style: style,
      query: query,
      active: true
    };

    if (collections.length === 1) {
      alert('Streaming');
      $scope.hashtags = '';
    } else {
      collections.push(collection);
      $scope.hashtags = '';
      $scope['tweets_' + query] = [];
      update(collection);
      stream(query, collection);
    }
  };

  $scope.remove = function(collection) {
    var collections = $scope.collections;
    collections.splice(0, 1);
    socket.emit('remove', collection.query);
  };

  function update(collection) {
    $scope.tweets = $scope['tweets_' + collection.query];
  }

  function stream(query, collection) {
    var limit = 10;
    socket.emit('query', query);
    $scope['tweets_' + query] = [];
    socket.on('tweet_' + query, function(tweet) {
      if ($scope['tweets_' + query].length == limit) {
        $scope['tweets_' + query].shift();
      }
      $scope['tweets_' + query] = $scope['tweets_' + query].concat(tweet);
      update(collection);
    });
  }
}]);