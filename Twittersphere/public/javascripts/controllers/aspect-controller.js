/** Controller for the live line chart */
app.controller('AspectCtrl', ['$scope', 'socket', function($scope, socket) {
  var timestamp = ((new Date()).getTime() / 1000) | 0;
  
  $scope.realtimeLine = [
    {values: [{time: timestamp, y: 0}]},
    {values: [{time: timestamp, y: 0}]},
    {values: [{time: timestamp, y: 0}]}
  ];

  $scope.getNextLiveLine = function(data) {
    $scope.realtimeLineFeed = data;
  }

  socket.on('aspect', function(data) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    var result = [
      {time: timestamp, y: data.neutral},
      {time: timestamp, y: data.negative},
      {time: timestamp, y: data.positive}
    ]; 
    $scope.aspect = data;
    $scope.getNextLiveLine(result);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);