app.controller('CPUCtrl', ['$scope', 'socket', function($scope, socket) {
  var timestamp = ((new Date()).getTime() / 1000) | 0;

  $scope.usage;

  $scope.realtimeArea = [{values: [{time: timestamp, y: 0}]}];

  $scope.getNextLiveArea = function(data) {
    $scope.realtimeAreaFeed = data;
  }

  socket.on('usage', function(usage) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    var result = [{time: timestamp, y: usage}];

    $scope.usage = usage;
    $scope.getNextLiveArea(result);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);