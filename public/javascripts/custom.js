//$.backstretch("/images/background1.jpg");
//var socket = io.connect('http://localhost'); // change to appropiate for network access
var $pad = $(".pad")
                            .xy({
                                    displayPrevious:false
                                    , min : 0
                                    , max : 127
                                    , fgColor:"#fff"
                                    , bgColor:"#EEEEEE"
                                    , change : function (value) {
                                        //console.log("change : ", value);
                                        socket.emit('notedown',{message: value[0], message1: value[1]});
                                    }
                                })
                            .css({'border':'4px dashed #fff'});

var dial = $(".dial")
                    .dial({
                            min: 0
                            , max:127
                            , fgColor:"#fff"
                            , bgColor:"#333333"
                            , cursor: 50
                            , change : function (value) {
                                        //console.log("change : ", value);
                                        socket.emit('dialchange',{message: value});
                                    }
                        })
                    .css({display:'inline'});


$(".bars").bars({
                            fgColor:"#fff"
                            , bgColor:"#EEEEEE"
                            , change : function (value) {
                                        console.log("change : ", value);

                                        if(value[0] !== undefined){
                                        socket.emit('bar1change',{message: value[0]});
                                        }
                                        if(value[1] !== undefined){
                                        socket.emit('bar2change',{message: value[1]});
                                        }
                                        if(value[2] !== undefined){
                                        socket.emit('bar3change',{message: value[2]});
                                        }
                                        if(value[3] !== undefined){
                                        socket.emit('bar4change',{message: value[3]});
                                        }
                                    }
                        });

                             //var pulse = new Pulse();
                             //pulse.connect('http://localhost');
                             function show(){
                                // document.getElementById('record').style.transform = 'rotate(' + (pulse.beat() % 1) * 360 + 'deg)';
                                // var r = 'rotate(' + (pulse.beat() % 8) * 45 + 'deg)';
                                // $('#deck div').css('transform', r);
                                $('#overlay').css('opacity', pulse.pulse() * 0.1)
                                //$("#redbar").css('width', pulse.pulse() * 100 + '%');
                                $("p#lefttext").text('Network Latency: ' + Math.round(pulse.netLatency) + 'ms');
                                $("p#bpm").text('BPM: ' + Math.round(pulse.bpm));
                                setTimeout(show, 10);
                            }
                             show();


document.onmousedown=disableclick;
function disableclick(event)
{
  if(event.button==2)
   {
     return false;    
   }
}
