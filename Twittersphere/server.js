/** Required dependencies */
var http = require('http');
var app = require('./app/express');
var server = http.Server(app);
var io = require('./app/models/io')(server);

/** Identify port from environment */
var port = process.env.PORT || 8080;

/** Listen on the specified port and log a message to the console */
server.listen(port);
console.log('Server listening on port ' + port);
