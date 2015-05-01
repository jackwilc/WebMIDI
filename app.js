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
    midiOut = new midi.output(),
    input = new midi.input();
var devices = [];
var os = require('os');
var ifaces = os.networkInterfaces();
var storage = require('node-persist');

//Set up server and socketIO
var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');
var app = module.exports = express.createServer(),
    io = io.listen(app);
var serverIP = "127.0.0.1";
var connect = false;
var disconnect = false;
var traktorPort = null;
var fx = 1;
var deck = 1;
var server;
var beats = [];


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
deck = storage.getItem('deck');

//Scan for available input devices
for (var i = 0; i < input.getPortCount(); i ++){
  devices[i] = input.getPortName(i);
}

//Open virtual MIDI port
midiOut.openVirtualPort('webMIDI');

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
app.get('/javascripts/socket.js', function (req, res) {
  res.setHeader("Content-Type", "text/javascript");
  res.send('var socket = io.connect("http://' + serverIP + '");var pulse = new Pulse();pulse.connect("http://' + serverIP + '");var flashing = '+ storage.getItem('flashing') +';$("#fx' + fx + '").addClass("active");$("#deck' + deck + '").addClass("active");var touchxy = false;') 
})

console.log("-------------------------------------------------");
console.log("   WEB MIDI v0.1   [Detected IP: " + serverIP + "]" );
console.log("-------------------------------------------------");

//If program missing required arguments
if (process.argv.length < 3){
  console.log('Run the server using arguments [device_id]');
  console.log('');
  console.log("The following MIDI devices were detected:");
  console.log("-------------------------------------------------");
  if (devices.length == 0){
    console.log("*** NO DEVICES DETECTED ***");
  } else {
    for (var i = 0; i < devices.length; i ++){
      console.log( "id: " + i + "\t" + devices[i]);
      if(devices[i] == "Traktor Virtual Output"){
        console.log("Traktor Output Detected!");
      }
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
    if(!connect){
    console.log("Client connected.");
    connect = true;
    }
  else
  {
    connect = false;
  }
    socket.emit('serverIP',{'message':serverIP});

    socket.on('disconnect', function(reason){
      
      if(!disconnect){
      console.log("Disconnected: " + reason);
      disconnect = true;
      }
      else
      {
      disconnect = false;
      }
      

    });

    socket.on('ping', function(){
      socket.emit('pong');
    });

  });


var midiReceived = function(deltaTime, message){
    // Throttle the number of clock messages sent.
    // The midi standard of 24 pulses-per-quarter-note 
    // (e.g. 120*24 = 2880 messages per second @ 12bpm) is a
    // little height to pump through a web socket.
    if(message != 248){
    console.log(message);

    if(message[1] == 10){
      console.log('loop a changed!');
      io.sockets.emit('loopset', message[2]); 
    }
    if(message[1] == 11){
      console.log('loop active');
      io.sockets.emit('loopactive', message[2]); 
    }
    if(message[1] == 12){
      console.log('loop b changed!');
      io.sockets.emit('loopsetb', message[2]); 
    }
    if(message[1] == 13){
      console.log('loop b active');
      io.sockets.emit('loopactiveb', message[2]); 
    }
    if(message[1] == 16){
      console.log('flux a on');
      io.sockets.emit('fluxona', message[2]); 
    }
    if(message[1] == 17){
      console.log('flux b on');
      io.sockets.emit('fluxonb', message[2]); 
    }

  }

    if (message == MIDI_CLOCK){
        var time = process.hrtime();
        time = time[1] / 1000000;
        
        // convert 'milliseconds per beats to 'beats per minute'
        //bpm = 60 / bpm;

      beats.push(time);
      if (beats.length > 1){
      if (beats.length > 10){
        beats.shift()
      }
      var bpm = (beats[0] - beats[beats.length-1]) / 1;
      //this.mspb = (this.beats[this.beats.length-1] - this.beats[0]) / (this.beats.length-1);
      // convert 'milliseconds per beats to 'beats per minute'
      bpm = bpm;
  
    }

        
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

//When web socket receives a connection from the browser
io.sockets.on('connection', function (socket) {

  //When xy pad is changed/
  socket.on('notedown',function(data){
    midiOut.sendMessage(help.noteOn(60 + (10 * (fx - 1)), data.message));
    midiOut.sendMessage(help.noteOn(61 + (10 * (fx - 1)), data.message1));
    //console.log('Midi out CH' + (60 + (10 * (fx - 1))) + "FX = " + fx);
  });

  socket.on('trackseek',function(data){
    midiOut.sendMessage(help.noteOn(2 + (deck - 1), data.message));
    //console.log('Midi out CH' + (60 + (10 * (fx - 1))) + "FX = " + fx);
  });

  socket.on('dialchange',function(data){

    console.log("Dial Changed" + data.message);
    midiOut.sendMessage(help.noteOn(76), 3);

  });


  socket.on('setting_flashing',function(data){

    storage.setItem('flashing', data.message);

  });

  

  socket.on('change_fx',function(data){

    fx = data.number;
    storage.setItem('fx', data.number);
    socket.emit('change_fx',{'number':data.number});

  });

  socket.on('change_deck',function(data){

    console.log(data.number);
    deck = data.number;
    storage.setItem('deck', data.number);
    socket.emit('change_deck',{'number':data.number});

  });

  socket.on('halfloop',function(data){
      midiOut.sendMessage(help.noteOn(84 + (10 * (deck - 1)), 100));
    console.log('halfloop');
  });

  socket.on('doubleloop',function(data){
      midiOut.sendMessage(help.noteOn(85 + (10 * (deck - 1)), 100));
    console.log('doubleloop');
  });

  socket.on('hc1d1',function(data){
      midiOut.sendMessage(help.noteOn(10, 100));
    console.log('hc1d1');
  });

  socket.on('hc1d2',function(data){
      midiOut.sendMessage(help.noteOn(11, 100));
    console.log('hc1d2');
  });

  socket.on('hc2d1',function(data){
      midiOut.sendMessage(help.noteOn(12, 100));
    console.log('hc2d1');
  });

  socket.on('hc2d2',function(data){
      midiOut.sendMessage(help.noteOn(13, 100));
    console.log('hc2d2');
  });

  socket.on('browser',function(data){
      midiOut.sendMessage(help.noteOn(123, 100));
    console.log('browser');
  });

  socket.on('loop',function(data){

    switch(data.length) {
      case 0.25:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(76 + (10 * (deck - 1)), 100));
        
        break;
        case 0.5:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(77 + (10 * (deck - 1)), 100));
        console.log((77 + (10 * (deck - 1))));
        break;
        case 1:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(78 + (10 * (deck - 1)), 100));
        console.log((78 + (10 * (deck - 1))));
        break;
        case 2:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(79 + (10 * (deck - 1)), 100));
        console.log((79 + (10 * (deck - 1))));
        break;
    case 4:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(80 + (10 * (deck - 1)), 100));
        console.log((80 + (10 * (deck - 1))));
        break;
    case 8:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(81 + (10 * (deck - 1)), 100));
        break;
    case 16:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(82 + (10 * (deck - 1)), 100));
        break;
    case 32:
        midiOut.sendMessage(help.noteOn(75 + (10 * (deck - 1)), 100));
        midiOut.sendMessage(help.noteOn(83 + (10 * (deck - 1)), 100));
        break;
    default:
       
    }

  });

function notesoff(){

  var i;

  for (i = 0; i < 128; i++) { 
    midiOut.sendMessage(help.noteOff(i, 100));
  }

}

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

  socket.on('fx_on',function(data){

    notevalue = 58 + (10 * (fx - 1));

    if(data.value){

    midiOut.sendMessage(help.noteOn(notevalue, 127));
    console.log('fx_on: ' + notevalue);

    }else{

      console.log('fx_off: ' + notevalue + 1);
      midiOut.sendMessage(help.noteOn(notevalue + 1, 127));
      midiOut.sendMessage(help.noteOff(notevalue, 127));
      setTimeout(function(){ 
            midiOut.sendMessage(help.noteOff(notevalue + 1, 127));
              }, 500);
      //setTimeout(notesoff, 200);

  }

  });

  socket.on('screenheight',function(data){
    console.log(data.height);
  });

  socket.on('menuup',function(data){
    console.log('menu up');
    midiOut.sendMessage(help.noteOn(124, 127));
  });

  socket.on('menudown',function(data){
    console.log('menu down');
    midiOut.sendMessage(help.noteOn(125, 127));
  });

  socket.on('loada',function(data){
    console.log('loada');
    midiOut.sendMessage(help.noteOn(126, 127));
  });

  socket.on('loadb',function(data){
    console.log('loadb');
    midiOut.sendMessage(help.noteOn(127, 127));
  });

});

//Close MIDI port on termination///
process.on("SIGTERM", function(){

  midiOut.closePort();
  server.close();

});


// Start Server//////
try{
server = app.listen(port);
} catch(er) {
  console.log("ERROR! Server could not listen on port " + port + ". Please check that webMIDI is not already running.");
}