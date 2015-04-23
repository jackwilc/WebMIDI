touchxy = true;
numtouches = 0;
var ntouches = 0;
var oldx = 0;
var oldy = 0;
var oldxx = 0;
var oldyy = 0;
var olddistance = 0;
var supportsVibrate = "vibrate" in navigator;

var $pad = $(".pad")

                            .xy({
                                    displayPrevious:false
                                    , min : 0
                                    , max : 127
                                    , stretch: true
                                    , cursor: 1
                                    , fgColor:"#fff"
                                    , bgColor:"#EEEEEE"
                                    , change : function (value) {
                                          
                                          console.log('yo' + value['touches']);

                                        //console.log("change : ", value);
                                        if(value['touches'] != 2){
                                          socket.emit('notedown',{message: value[0], message1: value[1]});
                                        }else{
                                          socket.emit('trackseek',{message: value[0]});
                                        }
                                        
                                    }
                                })
                            .css({'border':'0px dashed #fff'});


$( "#xy" ).bind( "touchmove", function(e) {
  console.log('TOUCHES' + e.originalEvent.touches.length);
  ntouches = e.originalEvent.touches.length;
});

seek = true;
var $pad = $(".trackseek")
                            .xy({
                                    displayPrevious:false
                                    , min : 0
                                    , max : 126
                                    , stretch: true
                                    , cursor: 20
                                    , fgColor:"#fff"
                                    , bgColor:"#000000"
                                    , change : function (value) {
                                        //console.log("change : ", value);

                                        socket.emit('trackseek',{message: value[0]});
                                        
                                    }
                                })
                            .css({'border-top':'1px dashed #fff','border-bottom':'1px dashed #fff'}); 




var dial = $(".dial")
                    .dial({
                            min: 0
                            , max:127
                            , fgColor:"#fff"
                            , bgColor:"#333333"
                            , cursor: 50
                            , flatMouse: true
                            , change : function (value) {
                                        console.log("change : ", value);
                                        socket.emit('dialchange' , { message: value });
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
                                $("#latency").text('Network Latency: ' + Math.round(pulse.netLatency) + 'ms');
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
    $("#fx1").addClass('active');
    $("#fx2").removeClass('active');
    socket.emit('change_fx',{number: 1});
});
$( "#fx2" ).click(function() {
    $("#fx2").addClass('active');
    $("#fx1").removeClass('active');
    socket.emit('change_fx',{number: 2});
});

$( "#halfloop" ).click(function() {
    socket.emit('halfloop');
});
$( "#doubleloop" ).click(function() {

    socket.emit('doubleloop');
});

$( "#hc1d1" ).click(function() {

    socket.emit('hc1d1');
});

$( "#hc1d2" ).click(function() {

    socket.emit('hc1d2');
});

$( "#hc2d1" ).click(function() {

    socket.emit('hc2d1');
});

$( "#hc2d2" ).click(function() {

    socket.emit('hc2d2');
});

$( "#deck1" ).click(function() {
    $("#deck1").addClass('active');
    $("#deck2").removeClass('active');
    socket.emit('change_deck',{number: 1});
});
$( "#deck2" ).click(function() {
    $("#deck2").addClass('active');
    $("#deck1").removeClass('active');
    socket.emit('change_deck',{number: 2});
});

$( "#quart" ).click(function() {
    socket.emit('loop',{length: 0.25});
});

$( "#half" ).click(function() {
    socket.emit('loop',{length: 0.5});
});

$( "#1" ).click(function() {
    socket.emit('loop',{length: 1});
});

$( "#2" ).click(function() {
    socket.emit('loop',{length: 2});
});

$( "#4" ).click(function() {
    socket.emit('loop',{length: 4});
});

$( "#8" ).click(function() {

    socket.emit('loop',{length: 8});
});

$( "#16" ).click(function() {

    socket.emit('loop',{length: 16});
});

$( "#32" ).click(function() {

    socket.emit('loop',{length: 32});
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
$('#fxtoggle').toggles({ });
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
    socket.emit('setting_flashing',{message: true});
    flashing = true;
  } else {
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

var newwidth;

if($(window).width() > 500){
  newwidth = 500;
}else{
  newwidth = $(window).width();
}

if($(window).height() < newwidth + 128 + 65){
  $( "#fx3" ).hide();
  $( "#fx4" ).hide();
  $( "#lower" ).hide();
}

if($(window).height() > 500){

}


    $( ".container" ).css( "width", newwidth);
    $( ".quartbutton" ).css( "width", ((newwidth/4) - 10));
    $( ".halfbutton" ).css( "width", ((newwidth/2) - 8));
    $( ".footerbuttons" ).css( "width", ((newwidth/4 - 12)));
    $( ".site-footer" ).css( "width", newwidth);
    $( "#buttongroup" ).css( "width", newwidth);
  
$( ".container" ).css( "height" , $(window).height() - 65);
$( ".swipearea" ).css( "height" , $(window).height() - 30);
$( window ).resize(function() {
  $( ".container" ).css( "height" , $(window).height() - 65);
});

$(".swipearea").swipe( {

        tap:function(event, target) {
          socket.emit('browser');
        },

        swipeLeft:function(event, direction, distance, duration, fingerCount) {
          socket.emit('loada');
          navigator.vibrate(300);
        },

        swipeRight:function(event, direction, distance, duration, fingerCount) {
          socket.emit('loadb'); 
          navigator.vibrate(300);
        },
        

        swipeStatus:function(event, phase, direction, distance, duration, fingers)
        {

  
          

          var newdistance; 

        



          
          var str = "<h4>Swipe Phase : " + phase + "<br/>";
          str += "Direction from inital touch: " + direction + "<br/>";
          str += "Distance from inital touch: " + distance + "<br/>";
          str += "Duration of swipe: " + duration + "<br/>";
          str += "Fingers used: " + fingers + "<br/></h4>";


          newdistance = distance / 40;

          newdistance = Math.floor(newdistance);

          str += "5distance " + newdistance + "<br/></h4>";

          direction = direction;

          if(direction == null){
            olddistance = 0;
          }

          if(direction=="down"){
            if(newdistance >= olddistance + 1){
            olddistance = newdistance;
            socket.emit('menuup');
          }

          if(newdistance <= olddistance - 1){
            olddistance = newdistance;
            socket.emit('menudown');
          }
          }

          if(direction=="up"){
            if(newdistance >= olddistance + 1){
            olddistance = newdistance;
            socket.emit('menudown');
          }

          if(newdistance <= olddistance - 1){
            olddistance = newdistance;
            socket.emit('menuup');
          }
          }
          


          

        



          //Here we can check the:
          //phase : 'start', 'move', 'end', 'cancel'
          //direction : 'left', 'right', 'up', 'down'
          //distance : Distance finger is from initial touch point in px
          //duration : Length of swipe in MS 
          //fingerCount : the number of fingers used
          if (phase!="cancel" && phase!="end") {
            if (duration<5000)
              str +="Under maxTimeThreshold.<h3>Swipe handler will be triggered if you release at this point.</h3>"
            else
              str +="Over maxTimeThreshold. <h3>Swipe handler will be canceled if you release at this point.</h3>"
          
            if (distance<200)
              str +="Not yet reached threshold.  <h3>Swipe will be canceled if you release at this point.</h3>"
            else
              str +="Threshold reached <h3>Swipe handler will be triggered if you release at this point.</h3>"
          }
          
          if (phase=="cancel") olddistance = 0;
          if (phase=="end") olddistance = 0;  
          
          $(".swipearea").html(distance);
        },
        threshold:100,
        maxTimeThreshold:5000,
        fingers:'all'
      });
$( "fieldset" ).hide();



      





