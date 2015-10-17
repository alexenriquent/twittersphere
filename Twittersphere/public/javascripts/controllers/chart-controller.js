/** Controller for the live line chart */
app.controller('ChartCtrl', ['$scope', 'socket', function($scope, socket) {
  var timestamp = ((new Date()).getTime() / 1000) | 0;
  
  $scope.realtimeLine = [
    {values: [{time: timestamp, y: 0}]},
    {values: [{time: timestamp, y: 0}]}
  ];

  $scope.getNextLiveLine = function(data) {
    $scope.realtimeLineFeed = data;
  }

  socket.on('analysis', function(data) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    var result = [
      {time: timestamp, y: data.score},
      {time: timestamp, y: data.comparative}
    ];
    $scope.result = data;
    $scope.getNextLiveLine(result);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);
