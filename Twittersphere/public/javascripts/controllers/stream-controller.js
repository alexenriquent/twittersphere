/** Controller for streaming inflow Twitter messages */
app.controller('StreamCtrl', ['$scope', 'socket', function($scope, socket) {
  $scope.collections = [];
  $scope.selectedIndex = 0;
  $scope.selected = selected;

  $scope.submit = function($event) {
    var numEvents = 13;
    if ($event.which !== numEvents) {
      return;
    }
    if ($scope.hashtags) {
      $scope.addCollection($scope.hashtags);
    }
  };

  $scope.add = function(query) {
    var collections = $scope.collections;
    var style = 'collection' + (collections.length % 4 + 1);
    var collection = {
      title: query,
      style: style,
      query: query,
      active: true
    };

    if (!duplicate(collection)) {
      collections.push(collection);
      $scope.hashtags = '';
      stream(query, collection);
    } else {
      alert('The query already exists');
    }
  };

  $scope.remove = function(collection) {
    var collections = $scope.collections;
    for (var i = 0; i < collections.length; i++) {
      if (collection.title == collections[i].title) {
        collections.splice(i, 1);
        $scope.selectedIndex = (i == 0 ? 1 : i - 1);
        socket.emit('remove', collection.query);
      }
    }
  };

  function selected(collection) {
    $scope.selectedIndex = this.$index;
    update(collection);
  }

  function update(collection) {
    if ($scope.collections[$scope.selectedIndex] && 
      $scope.collections[$scope.selectedIndex].query == collection.query) {
      $scope.tweets = $scope['tweets_' + collection.query];
    }
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

  function duplicate(collection) {
    var collections = $scope.collections;
    for (var i = 0; i < collections.length; i++) {
      if (collection.query == collections[i].query) {
        return true;
      }
    }
    return false;
  }
}]);