app.controller('CPUCtrl', ['$scope', 'socket', function($scope, socket) {
  $scope.usage;

  socket.on('usage', function(usage) {
    $scope.usage = usage;
  });
}]);