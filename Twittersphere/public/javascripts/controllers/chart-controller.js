app.controller('ChartCtrl', ['$scope', 'socket', '$timeout', function($scope, socket, $timeout) {
  // var RealTimeData = function(layers) {
  //   this.layers = layers;
  //   this.timestamp = ((new Date()).getTime() / 1000)|0;
  // };

  // RealTimeData.prototype.rand = function() {
  //   return parseInt(Math.random() * 10) + 5;
  // };

  // RealTimeData.prototype.history = function(entries) {
  //   if (typeof(entries) != 'number' || !entries) {
  //       entries = 60;
  //   }

  //   var history = [];
  //   for (var k = 0; k < this.layers; k++) {
  //       history.push({ values: [] });
  //   }

  //   for (var i = 0; i < entries; i++) {
  //     for (var j = 0; j < this.layers; j++) {
  //       history[j].values.push({time: this.timestamp, y: this.rand()});
  //     }
  //     this.timestamp++;
  //   }
  //   return history;
  // };

  // RealTimeData.prototype.next = function() {
  //   var entry = [];
  //   for (var i = 0; i < this.layers; i++) {
  //     entry.push({ time: this.timestamp, y: this.rand() });
  //   }
  //   this.timestamp++;
  //   return entry;
  //   }

  // window.RealTimeData = RealTimeData;

  // var liveData = new RealTimeData(1);
  var timestamp = ((new Date()).getTime() / 1000) | 0;
  $scope.realtimeLine = [{values: [{time: timestamp, y: 0}]}];
  // $scope.realtimeLine = liveData.history();
  // console.log($scope.realtimeLine);
  // $scope.realtimeLineFeed = liveData.next();
  // console.log($scope.realtimeLineFeed);
  $scope.getNextLiveLine = function(data) {
    console.log('getNextLiveLine()');
    $scope.realtimeLineFeed = data;
    // $timeout($scope.getNextLiveLine, 1000);
  }
  // $timeout($scope.getNextLiveLine, 1000);

  socket.on('analysis', function(data) {
    var timestamp = ((new Date()).getTime() / 1000) | 0;
    $scope.result = [{time: timestamp, y: data.score}];
    $scope.getNextLiveLine($scope.result);
  });

  $scope.areaAxes = ['left','right','bottom'];
}]);
