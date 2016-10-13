var events = require("events");
var io = require('socket.io-client');

var Receiver = function () {};
Receiver.prototype = new events.EventEmitter;

Receiver.prototype.connect = function() {
  console.log('Attempting to connect socket.io to socket server: ' + window.location.href);
  var socket = io.connect(window.location.href);

  socket.on('connect', data => {
    console.log('CONNECTED: socket.io to socket server: ' + window.location.href);
  })

  socket.on('pulse', data => {
    console.log('Receiver: Received pulse');
    this.emit('pulse', data);
  });

  socket.on('pulsar control', data => {
    console.log('Receiver: Received control pulse');
    this.emit('pulsar control', data);
  });

  socket.on('pulse update', data => {
    console.log('Receiver: Received update pulse');
    this.emit('pulse update', data);
  });
}

module.exports = Receiver;
