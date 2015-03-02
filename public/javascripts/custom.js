//$.backstretch("/images/background1.jpg");
//var socket = io.connect('http://localhost'); // change to appropiate for network access
touchxy = true;
numtouches = 0;
var $pad = $(".pad")
                            .xy({
                                    displayPrevious:false
                                    , min : 0
                                    , max : 127
                                    , cursor: 1
                                    , fgColor:"#fff"
                                    , bgColor:"#EEEEEE"
                                    , change : function (value) {
                                        //console.log("change : ", value);
                                        socket.emit('notedown',{message: value[0], message1: value[1]});
                                    }
                                })
                            .css({'border':'0px dashed #fff'});

var dial = $(".dial")
                    .dial({
                            min: 0
                            , max:127
                            , fgColor:"#fff"
                            , bgColor:"#333333"
                            , cursor: 50
                            , flatMouse: true
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
                                if(flashing){
                                $('#overlay').css('opacity', pulse.pulse() * 0.1) }

                                if(socket.connected){
                                    $("#lc").hide();
                                }else{
                                    $("#lc").show();
                                }


                                //$("#redbar").css('width', pulse.pulse() * 100 + '%');
                                $("p#lefttext").text('Network Latency: ' + Math.round(pulse.netLatency) + 'ms');
                                $("p#bpm").text('BPM: ' + Math.round(pulse.bpm));
                                setTimeout(show, 100);
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
var settings = false;
$( ".settingsbutton" ).click(function() {
  if(!settings){
  $( "#settings" ).show();
  settings = true;
} else {
  $( "#settings" ).hide();
  settings = false;
}
});
if(flashing){
    $( ".flashingbutton" ).text("Flashing ON");
}else{
    $( ".flashingbutton" ).text("Flashing OFF");
}
$( ".flashingbutton" ).click(function() {
  if(!flashing){
    socket.emit('setting_flashing',{message: true});
    $( ".flashingbutton" ).text("Flashing ON");
  flashing = true;
} else {
    socket.emit('setting_flashing',{message: false});
    $('#overlay').css('opacity', 0);
    $( ".flashingbutton" ).text("Flashing OFF");
  flashing = false;
}

});

$( "#fx1" ).click(function() {
    $("#fx1").css("background-color", "#F5A91D");
    $("#fx2").css("background-color", "#262626");
    socket.emit('change_fx',{number: 1});
});
$( "#fx2" ).click(function() {
    $("#fx2").css("background-color", "#F5A91D");
    $("#fx1").css("background-color", "#262626");
    socket.emit('change_fx',{number: 2});
});

socket.on('change_fx',function(data){

    console.log(data.number);

});

socket.emit('screenheight',{height: $(window).height()});

$('ul.tabs').each(function(){
    // For each set of tabs, we want to keep track of
    // which tab is active and it's associated content
    var $active, $content, $links = $(this).find('a');

    // If the location.hash matches one of the links, use that as the active tab.
    // If no match is found, use the first link as the initial active tab.
    $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
    $active.parent().addClass('activetab');

    $content = $($active[0].hash);

    // Hide the remaining content
    $links.not($active).each(function () {
      $(this.hash).hide();
    });

    // Bind the click event handler
    $(this).on('click', 'a', function(e){
      // Make the old tab inactive.
      $active.parent().removeClass('activetab');
      $content.hide();

      // Update the variables with the new link and content
      $active = $(this);
      $content = $(this.hash);

      // Make the tab active.
      $active.parent().addClass('activetab');
      $content.show();

      // Prevent the anchor's default click action
      e.preventDefault();
    });
  });
if(flashing){
$('#flashingtoggle').toggles({ on: true });
} else {
    $('#flashingtoggle').toggles({ });
}
if(flashing){
$('#effectstoggle').toggles({ on: true });
} else {
    $('#effectstoggle').toggles({ });
}
$('#flashingtoggle').on('toggle', function (e, active) {
  if (active) {
    console.log('active!');
    socket.emit('setting_flashing',{message: true});
    flashing = true;
  } else {
    console.log('not active');
    socket.emit('setting_flashing',{message: false});
    $('#overlay').css('opacity', 0);
    flashing = false;
  } 
});
$('#effectstoggle').on('toggle', function (e, active) {
  if (active) {
    socket.emit('setting_effects',{message: true});
    $('#xy').show();
  } else {
    socket.emit('setting_effects',{message: false});
    $('#xy').hide();
  } 
});
$( ".container" ).css( "width", $(window).width());
$( ".container" ).css( "height" , $(window).height() - 30);
$( window ).resize(function() {
  $( ".container" ).css( "height" , $(window).height() - 30);
});
