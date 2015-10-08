/** Controller for streaming inflow Twitter messages */
app.controller('StreamCtrl', ['$scope', 'socket', function($scope, socket) {
  $scope.tabs = [];
  $scope.selectedIndex = 0;
  $scope.onTabSelected = onTabSelected;

  $scope.addTab = function(title, query) {
    var tabs = $scope.tabs;
    var style = 'tab' + (tabs.length % 4 + 1);
    var tab = {
      title: title,
      active: true,
      style: style,
      query: query
    };

    if (!duplicate(tab)) {
      tabs.push(tab);
      $scope.tContent = '';
      $scope.tTitle = '';
      spawnSearch(query, tab);
    } else {
      alert('The query already exists');
    }
  };

  $scope.removeTab = function(tab) {
    var tabs = $scope.tabs;
    for (var i = 0; i < tabs.length; i++) {
      if (tab.title == tabs[i].title) {
        tabs.splice(i, 1);
        $scope.selectedIndex = (i == 0 ? 1 : i - 1);
        socket.emit('remove', tab.query);
      }
    }
  };

  $scope.submit = function($event) {
    if ($event.which !== 13) {
      return;
    }
    if ($scope.tTitle) {
      $scope.addTab($scope.tTitle, $scope.tContent);
    }
  };

  function onTabSelected(tab) {
    $scope.selectedIndex = this.$index;
    updateScope(tab);
  }

  function updateScope(tab) {
    if ($scope.tabs[$scope.selectedIndex] && 
      $scope.tabs[$scope.selectedIndex].query == tab.query) {
      $scope.tweets = $scope['tweets_' + tab.query];
    }
  }

  function spawnSearch(query, tab) {
    socket.emit('query', query);
    $scope['tweets_' + query] = [];
    socket.on('tweet_' + query, function(tweet) {
      console.log(query, tweet.id);
      if ($scope['tweets_' + query].length == 10) {
        $scope['tweets_' + query].shift();
      }
      $scope['tweets_' + query] = $scope['tweets_' + query].concat(tweet);
      updateScope(tab);
    });
  }

  function duplicate(tab) {
    var tabs = $scope.tabs;
    for (var i = 0; i < tabs.length; i++) {
      if (tab.query == tabs[i].query) {
        return true;
      }
    }
    return false;
  }
}]);