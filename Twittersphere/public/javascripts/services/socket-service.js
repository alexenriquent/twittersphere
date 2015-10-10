app.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect()
  });
});
