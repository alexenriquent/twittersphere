app.controller('CPUCtrl', ['$scope', 'socket', function($scope, socket) {
  var timestamp = ((new Date()).getTime() / 1000) | 0;

  $scope.usage;

  $scope.realtimeArea = [{values: [{time: timestamp, y: 0}]}];
  $scope.getNextLiveArea = function(data) {
    $scope.realtimeAreaFeed = data;
  }

  $scope.gauge = 0.5;
  $scope.getNextGauge = function(data) {
      $scope.gaugeFeed = data;
  }

  socket.on('usage', function(usage) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    var result = [{time: timestamp, y: usage}];

    $scope.usage = usage;
    $scope.getNextLiveArea(result);

    var result2 = usage/100;
    $scope.getNextGauge(result2);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);