//CONFIG
var port = 80;

//MIDI Variables
var MIDI_PPQN = 24;
var SOCKET_PPQN = 4;
var MIDI_CLOCK = 248;
var MIDI_START = 251;
var MIDI_CONTINUE = 252;
var clockCount = 0;
var help = require('midi-help');
var midi = require('midi'),
    midiOut = new midi.output();
var devices = [];

// Set up a new input.
var input = new midi.input();

//Scan for available devices
for (var i = 0; i < input.getPortCount(); i ++){
  devices[i] = input.getPortName(i);
}

//Set up server and socketIO
var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');
var app = module.exports = express.createServer(),
    io = io.listen(app);
<<<<<<< HEAD
=======
var serverIP = "127.0.0.1";
var connect = false;
var disconnect = false;
var traktorPort = null;
var fx = 1;
var server;

//Detect the local IP address of the machine
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
    ;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

      serverIP = iface.address;
      
  });
});

storage.initSync();
fx = storage.getItem('fx');

//Scan for available input devices
for (var i = 0; i < input.getPortCount(); i ++){
  devices[i] = input.getPortName(i);
}

//Open virtual MIDI port
midiOut.openVirtualPort('webMIDI');
>>>>>>> parent of 8995ef9... Multiple Updates

//Web Server Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Add Routes
app.get('/', routes.index);
app.get('/dial', routes.dial);
app.get('/bars', routes.bars);
<<<<<<< HEAD
=======
app.get('/javascripts/socket.js', function (req, res) {
  res.setHeader("Content-Type", "text/javascript");
  res.send('var socket = io.connect("http://' + serverIP + '");var pulse = new Pulse();pulse.connect("http://' + serverIP + '");var flashing = '+ storage.getItem('flashing') +';$("#fx' + fx + '").css("background-color", "#F5A91D");var touchxy = false;') 
})
>>>>>>> parent of 8995ef9... Multiple Updates

console.log("-----------------------------------------");
console.log("WEB MIDI");
console.log("-----------------------------------------");

//If program missing required arguments
if (process.argv.length < 3){
  console.log('Run the server using arguments [device_id] [port]');
  console.log('');
  console.log("The following MIDI devices were detected:");
  console.log("-----------------------------------------");
  if (devices.length == 0){
    console.log("...NO DEVICES DETECTED...");
  } else {
    for (var i = 0; i < devices.length; i ++){
      console.log( "id: " + i + "\t" + devices[i]);
    }
  }
  console.log('');
  process.exit(0);
} else {

  var deviceID = parseInt(process.argv[2])

  if (deviceID >= devices.length){
    console.log('ERROR: UNKNOWN DEVICE ID');
    process.exit(0);
  }

  console.log("Listening to device " + deviceID + ": " + devices[deviceID])

  io.sockets.on('connection', function (socket) {
    console.log("Client connected.");

    socket.on('disconnect', function(reason){
      console.log("Disconnected: " + reason);
    });

    socket.on('ping', function(){
      socket.emit('pong');
    });
  });
var midiReceived = function(deltaTime, message){
    // Throttle the number of clock messages sent.
    // The midi standard of 24 pulses-per-quarter-note 
    // (e.g. 120*24 = 2880 messages per second @ 12bpm) is a
    // little high to pump through a web socket.
    if (message == MIDI_CLOCK){
      if (clockCount % (MIDI_PPQN/SOCKET_PPQN) == 0){
        io.sockets.emit('midi', message); 
        clockCount = 0;
      }
      clockCount ++;
    } else {
      io.sockets.emit('midi', message);
      if (message == MIDI_START || message == MIDI_CONTINUE){
        clockCount = 0;
      }
    }
  }

  //Open the input port
  input.openPort(deviceID);
  input.ignoreTypes(false, false, false);
  input.on('message', midiReceived);  

}

//Open available MIDI port
try {
  midiOut.openPort(0);
} catch(error) {
  midiOut.openVirtualPort('');
}


//When web socket receives a connection
io.sockets.on('connection', function (socket) {

  //When xy pad is changed/
  socket.on('notedown',function(data){
<<<<<<< HEAD
    midiOut.sendMessage(help.noteOn(60, data.message));
    midiOut.sendMessage(help.noteOn(61, data.message1));
    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('dialchange',function(data){
    midiOut.sendMessage(help.noteOn(62, data.message));
    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('barchange',function(data){
    midiOut.sendMessage(help.noteOn(63, data.message));
    socket.broadcast.emit('playeddown',{'message':data.message});
  });

=======
    midiOut.sendMessage(help.noteOn(60 + (10 * (fx - 1)), data.message));
    midiOut.sendMessage(help.noteOn(61 + (10 * (fx - 1)), data.message1));
    //console.log('Midi out CH' + (60 + (10 * (fx - 1))) + "FX = " + fx);
  });

  socket.on('dialchange',function(data){
    midiOut.sendMessage(help.noteOn(62 + (10 * (fx - 1)), data.message));
    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('bar1change',function(data){

    midiOut.sendMessage(help.noteOn(63 + (10 * (fx - 1)), data.message));

    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('bar2change',function(data){

    midiOut.sendMessage(help.noteOn(64 + (10 * (fx - 1)), data.message));

    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('bar3change',function(data){

    midiOut.sendMessage(help.noteOn(65 + (10 * (fx - 1)), data.message));

    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('bar4change',function(data){

    midiOut.sendMessage(help.noteOn(66 + (10 * (fx - 1)), data.message));

    socket.broadcast.emit('playeddown',{'message':data.message});
  });

  socket.on('setting_flashing',function(data){

    storage.setItem('flashing', data.message);

  });

  socket.on('change_fx',function(data){

    console.log(data.number);
    fx = data.number;
    storage.setItem('fx', data.number);
    socket.emit('change_fx',{'number':data.number});

  });

>>>>>>> parent of 8995ef9... Multiple Updates
  // note stop
  socket.on('noteup',function(data){
    midiOut.sendMessage([128,data.message,100]);
    socket.broadcast.emit('playedup',{'message':data.message});
  });

  // controller
  socket.on('controller',function(data){
    var message = parseInt(data.message,10);
    midiOut.sendMessage([message,0,0]);
  });

<<<<<<< HEAD
=======
  socket.on('fx_on',function(data){

    notevalue = 58 + (10 * (fx - 1));

    if(data.value){

    midiOut.sendMessage(help.noteOn(notevalue, 127));
  }else{

      midiOut.sendMessage(help.noteOn(notevalue + 1, 127));
  }

  });

  socket.on('screenheight',function(data){
    console.log(data.height);
  });

>>>>>>> parent of 8995ef9... Multiple Updates
});

//Close MIDI port on termination///
process.on("SIGTERM", function(){
  midiOut.closePort();
});

// Start Server//////
app.listen(port);