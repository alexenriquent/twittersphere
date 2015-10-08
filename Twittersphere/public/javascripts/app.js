/** Initialise an Angular module and inject the dependencies */
var app = angular.module('twittersphereApp', ['ngMaterial', 'btford.socket-io'])
  .factory('socket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:8080')
    });
  }).controller('AppCtrl', ['$scope', 'socket', function($scope, socket) {
    $scope.tabs = [];
    $scope.selectedIndex = 0;
    $scope.onTabSelected = onTabSelected;

    $scope.addTab = function(title, q) {
      var tabs = $scope.tabs;
      var style = 'tab' + (tabs.length % 4 + 1);
      var tab = {
        title: title,
        active: true,
        style: style,
        q: q
      };

      if (!dupes(tab)) {
        tabs.push(tab);
        $scope.tContent = '';
        $scope.tTitle = '';
        spawnSearch(q, tab);
      } else {
        alert('A search with this query already exists');
      }
    };

    $scope.removeTab = function(tab) {
      var tabs = $scope.tabs;
      for (var i = 0; i < tabs.length; i++) {
        if (tab.title == tabs[i].title) {
          tabs.splice(i, 1);
          $scope.selectedIndex = (i == 0 ? 1 : i - 1);
          socket.emit('remove', tab.q);
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
        $scope.tabs[$scope.selectedIndex].q == tab.q) {
        $scope.tweets = $scope['tweets_' + tab.q];
      }
    }

    function spawnSearch(q, tab) {
      socket.emit('q', q);
      $scope['tweets_' + q] = [];
      socket.on('tweet_' + q, function(tweet) {
        console.log(q, tweet.id);
        if ($scope['tweets_' + q].length == 10) {
          $scope['tweets_' + q].shift();
        }
        $scope['tweets_' + q] = $scope['tweets_' + q].concat(tweet);
        updateScope(tab);
      });
    }

    function dupes(tab) {
      var tabs = $scope.tabs;
      for (var i = 0; i < tabs.length; i++) {
        if (tab.q == tabs.q) {
          return true;
        }
      }
      return false;
    }
  }]);