/** Required dependency */
var os = require('os');

function average() {
  var idles = 0;
  var ticks = 0;
  var cpus = os.cpus();

  for (var i in cpus) {
    var cpu = cpus[i];
    for (time in cpu.times) {
      ticks += cpu.times[time];
    }
    idles += cpu.times.idle;
  }

  return {
    idle: idles / cpus.length, 
    total: ticks / cpus.length
  };
}

function usage(callback, interval) {
  var start = average();

  setTimeout(function() {
    var finish = average();
    var idleDiff = finish.idle - start.idle;
    var totalDiff = finish.total - start.total;

    callback(100 - (100 * idleDiff / totalDiff));
  }, interval);
}

/** Export the module */
exports.usage = function(interval, callback) {
  usage(callback, interval);
};
