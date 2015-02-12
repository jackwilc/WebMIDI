//$.backstretch("/images/background1.jpg");
var socket = io.connect('http://192.168.0.3'); // change to appropiate for network access
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

$(".dial")
                    .dial({
                            min: 0
                            , max:127
                            , fgColor:"#fff"
                            , bgColor:"#333333"
                            , change : function (value) {
                                        //console.log("change : ", value);
                                        socket.emit('dialchange',{message: value});
                                    }
                        })
                    .css({display:'inline'});

$(".bars").bars({
                            fgColor:"#fff"
                            , bgColor:"#EEEEEE"
                        });

                             var pulse = new Pulse();
                             pulse.connect('http://192.168.0.3');
                             function show(){
                                // document.getElementById('record').style.transform = 'rotate(' + (pulse.beat() % 1) * 360 + 'deg)';
                                // var r = 'rotate(' + (pulse.beat() % 8) * 45 + 'deg)';
                                // $('#deck div').css('transform', r);
                                $('#overlay').css('opacity', pulse.pulse() * 0.1)
                                //$("#redbar").css('width', pulse.pulse() * 100 + '%');
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
