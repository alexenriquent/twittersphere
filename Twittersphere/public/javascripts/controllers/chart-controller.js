/** Controller for the live line chart */
app.controller('ChartCtrl', ['$scope', 'socket', '$timeout', function($scope, socket, $timeout) {
  var timestamp = ((new Date()).getTime() / 1000) | 0;
  
  $scope.realtimeLine = [
    {values: [{time: timestamp, y: 0}]},
    {values: [{time: timestamp, y: 0}]}
  ];

  $scope.getNextLiveLine = function(data) {
    console.log('getNextLiveLine()');
    $scope.realtimeLineFeed = data;
  }

  socket.on('analysis', function(data) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    $scope.result = [
      {time: timestamp, y: data.score},
      {time: timestamp, y: data.comparative}
    ];
    $scope.getNextLiveLine($scope.result);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);
