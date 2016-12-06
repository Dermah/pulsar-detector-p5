const EventEmitter = require('events');

class Ether extends EventEmitter {
  constructor(config) {
    super();

    let Router = require('./router.js');
    let router = new Router(config);

    this.io = require('socket.io')(router.server);

    // Socket.io connection handling
    this.io.on('connection', socket => {
      console.log('PULSAR-p5: client connected');
      socket.on('disconnect', () => {
        console.log('PULSAR-p5: client disconnected');
      });

      socket.on('pulse', pulse => {
        console.log('PULSAR-p5: emitting ' + pulse);
        this.emit('pulse', pulse);
      })
    });
  }

  detect (pulseType, pulse) {
    this.io.emit(pulseType, pulse);
  }
}

module.exports = Ether;
