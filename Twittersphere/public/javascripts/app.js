/** Initialise the angular module */
var app = angular.module('twittersphereApp', ['ngMaterial', 'btford.socket-io'])
  .factory('socket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:8080')
    });
  });