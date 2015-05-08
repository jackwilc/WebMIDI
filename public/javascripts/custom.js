touchxy = true;
numtouches = 0;
var ntouches = 0;
var oldx = 0;
var oldy = 0;
var oldxx = 0;
var oldyy = 0;
var olddistance = 0;
var supportsVibrate = "vibrate" in navigator;
var fadevar;
var scrolling = false;
var deckaloop = 0;
var loopaon = false;
var deckbloop = 0;
var loopbon = false;
var touchcount = 0;
var fluxaon = false;
var fluxbon = false;
var pitchaon = false;
var pitchbon = false;
Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
var $pad = $(".pad")

.xy({
    displayPrevious: false,
    min: 0,
    max: 127,
    stretch: true,
    cursor: 1,
    fgColor: "#fff",
    bgColor: "#EEEEEE",
    change: function(value) {



      if (twotouch) {
        socket.emit('notedown2', {
          message: points[0],
          message1: points[1]
        });
      }
      socket.emit('notedown', {
        message: value[0],
        message1: value[1]
      });



    }
  })
  .css({
    'border': '0px dashed #fff'
  });



seek = true;
var $pad = $(".trackseek")
  .xy({
    displayPrevious: false,
    min: 0,
    max: 126,
    stretch: true,
    cursor: 4,
    fgColor: "#FF3300",
    bgColor: "#000000",
    change: function(value) {
      //console.log("change : ", value);

      socket.emit('trackseek', {
        message: value[0]
      });

    }
  })
  .css({
    'border-top': '1px dashed #fff',
    'border-bottom': '1px dashed #fff'
  });



var dial = $(".dial")
  .dial({
    min: 0,
    max: 127,
    fgColor: "#fff",
    bgColor: "#333333",
    cursor: 50,
    flatMouse: true,
    change: function(value) {
      console.log("change : ", value);
      socket.emit('dialchange', {
        message: value
      });
    }
  })
  .css({
    display: 'inline'
  });


$(".bars").bars({
  fgColor: "#fff",
  bgColor: "#EEEEEE",
  change: function(value) {

    if (value[0] !== undefined) {
      socket.emit('bar1change', {
        message: value[0]
      });
    }
    if (value[1] !== undefined) {
      socket.emit('bar2change', {
        message: value[1]
      });
    }
    if (value[2] !== undefined) {
      socket.emit('bar3change', {
        message: value[2]
      });
    }
    if (value[3] !== undefined) {
      socket.emit('bar4change', {
        message: value[3]
      });
    }
  }
});

//var pulse = new Pulse();
//pulse.connect('http://localhost');
function show() {
  // document.getElementById('record').style.transform = 'rotate(' + (pulse.beat() % 1) * 360 + 'deg)';
  // var r = 'rotate(' + (pulse.beat() % 8) * 45 + 'deg)';
  // $('#deck div').css('transform', r);
  if (flashing) {
    $('#overlay').css('opacity', pulse.pulse() * 0.1)
  }

  if (socket.connected) {
    $("#lc").hide();
  } else {
    $("#lc").show();
  }


  //$("#redbar").css('width', pulse.pulse() * 100 + '%');
  $("#latency").text('Network Latency: ' + Math.round(pulse.netLatency) + 'ms');
  $("p#bpm").text('BPM: ' + Math.round(pulse.bpm));
  setTimeout(show, 100);
}
show();


document.ontouchstart = disableclick;

function disableclick(event) {
  if (event.button == 2) {
    return false;
  }
}
var settings = false;
$(".settingsbutton").click(function() {
  if (!settings) {
    $("#settings").show();
    settings = true;
  } else {
    $("#settings").hide();
    settings = false;
  }
});
if (flashing) {
  $(".flashingbutton").text("Flashing ON");
} else {
  $(".flashingbutton").text("Flashing OFF");
}
$(".flashingbutton").click(function() {
  if (!flashing) {
    socket.emit('setting_flashing', {
      message: true
    });
    $(".flashingbutton").text("Flashing ON");
    flashing = true;
  } else {
    socket.emit('setting_flashing', {
      message: false
    });
    $('#overlay').css('opacity', 0);
    $(".flashingbutton").text("Flashing OFF");
    flashing = false;
  }

});

$("#fx1").on("touchstart", function(ev) {
  fxval = 1;
  $("#fx1").addClass('active');
  $("#fx2").removeClass('active');
  socket.emit('change_fx', {
    number: 1
  });
});
$("#fx2").on("touchstart", function(ev) {
  fxval = 2;
  $("#fx2").addClass('active');
  $("#fx1").removeClass('active');
  socket.emit('change_fx', {
    number: 2
  });
});


$("#halfloop").click(function() {
  socket.emit('halfloop');
});
$("#doubleloop").click(function() {

  socket.emit('doubleloop');
});

$("#hc1d1").click(function() {

  socket.emit('hc1d1');
});

$("#hc1d2").click(function() {

  socket.emit('hc1d2');
});

$("#hc2d1").click(function() {

  socket.emit('hc2d1');
});

$("#hc2d2").click(function() {

  socket.emit('hc2d2');
});

function loophighlight(data) {


  switch (data) {
    case 3:
      $("#quart").addClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 4:
      $("#quart").removeClass('active');
      $("#half").addClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 5:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").addClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 6:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#2").addClass('active');
      $("#1").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 7:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").addClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 8:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").addClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;
    case 9:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").addClass('active');
      $("#32").removeClass('active');
      break;
    case 10:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").addClass('active');
      break;
    case -1:
      $("#quart").removeClass('active');
      $("#half").removeClass('active');
      $("#1").removeClass('active');
      $("#2").removeClass('active');
      $("#4").removeClass('active');
      $("#8").removeClass('active');
      $("#16").removeClass('active');
      $("#32").removeClass('active');
      break;

  }

}

$("#deck1").on("touchstart", function(ev) {
  if (loopaon) {

    loophighlight(deckaloop);



  } else {
    loophighlight(-1);
  }

  if (fluxaon) {
    $('#halfloop').addClass('active');
  } else {
    $('#halfloop').removeClass('active');
  }
  if (pitchaon) {
    $('#doubleloop').addClass('active');
  } else {
    $('#doubleloop').removeClass('active');
  }
  $("#deck1").addClass('active');
  $("#deck2").removeClass('active');
  socket.emit('change_deck', {
    number: 1
  });

});
$("#deck2").on("touchstart", function(ev) {
  if (loopbon) {

    loophighlight(deckbloop);
  } else {
    loophighlight(-1);
  }
  if (fluxbon) {
    $('#halfloop').addClass('active');
  } else {
    $('#halfloop').removeClass('active');
  }
  if (pitchbon) {
    $('#doubleloop').addClass('active');
  } else {
    $('#doubleloop').removeClass('active');
  }
  $("#deck2").addClass('active');
  $("#deck1").removeClass('active');
  socket.emit('change_deck', {
    number: 2
  });
});

$("#quart").on("touchstart", function(ev) {

  if ($('#deck2').hasClass('active')) {
    deckbloop = 3;
  } else {
    deckaloop = 3;
  }

  socket.emit('loop', {
    length: 0.25
  });
});
/*
$( "#quart" ).click(function() {
    socket.emit('loop',{length: 0.25});
}); */

$("#half").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 4;
  } else {
    deckaloop = 4;
  }
  socket.emit('loop', {
    length: 0.5
  });
});

$("#1").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 5;
  } else {
    deckaloop = 5;
  }
  socket.emit('loop', {
    length: 1
  });
});

$("#2").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 6;
  } else {
    deckaloop = 6;
  }
  socket.emit('loop', {
    length: 2
  });
});

$("#4").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 7;
  } else {
    deckaloop = 7;
  }
  socket.emit('loop', {
    length: 4
  });
});

$("#8").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 8;
  } else {
    deckaloop = 8;
  }
  socket.emit('loop', {
    length: 8
  });
});

$("#16").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 9;
  } else {
    deckaloop = 9;
  }
  socket.emit('loop', {
    length: 16
  });
});

$("#32").on("touchstart", function(ev) {
  if ($('#deck2').hasClass('active')) {
    deckbloop = 10;
  } else {
    deckaloop = 10;
  }
  socket.emit('loop', {
    length: 32
  });
});

socket.on('change_fx', function(data) {

  console.log(data.number);

});

socket.on('loopactive', function(data) {
  if (data == 0) {
    loopaon = false;
    if (!$('#deck2').hasClass('active')) {
      loophighlight(-1);
    }
  } else {
    loopaon = true;
    if (!$('#deck2').hasClass('active')) {
      loophighlight(deckaloop);
    }
  }
});

socket.on('fluxona', function(data) {

  if (data == 0) {
    if (!$('#deck2').hasClass('active')) {
      $('#halfloop').removeClass('active');
    }
    fluxaon = false;
  } else {
    if (!$('#deck2').hasClass('active')) {
      $('#halfloop').addClass('active');

    }
    fluxaon = true;
  }

});

socket.on('fluxonb', function(data) {

  if (data == 0) {
    if ($('#deck2').hasClass('active')) {
      $('#halfloop').removeClass('active');
    }
    fluxbon = false;
  } else {
    if (!$('#deck2').hasClass('active')) {
      $('#halfloop').addClass('active');

    }
    fluxbon = true;
  }

});

socket.on('pitchona', function(data) {

  if (data == 0) {
    if (!$('#deck2').hasClass('active')) {
      $('#doubleloop').removeClass('active');
    }
    pitchaon = false;
  } else {
    if (!$('#deck2').hasClass('active')) {
      $('#doubleloop').addClass('active');

    }
    pitchaon = true;
  }

});

socket.on('pitchonb', function(data) {

  if (data == 0) {
    if ($('#deck2').hasClass('active')) {
      $('#doubleloop').removeClass('active');
    }
    pitchbon = false;
  } else {
    if ($('#deck2').hasClass('active')) {
      $('#doubleloop').addClass('active');

    }
    pitchbon = true;
  }

});


socket.on('fluxonb', function(data) {
  if (data == 0 && $('#deck2').hasClass('active')) {
    $('#halfloop').removeClass('active');
  } else {
    $('#halfloop').addClass('active');
  }
});

socket.on('loopactiveb', function(data) {
  if (data == 0 && $('#deck2').hasClass('active')) {
    loopbon = false;
    loophighlight(-1);
  } else {
    loopbon = true;
    loophighlight(deckbloop);
  }
});



socket.on('loopset', function(data) {

  console.log(data.number);

  deckaloop = data;
  if (!$('#deck2').hasClass('active') && loopaon) {
    loophighlight(data);
  }

});



socket.on('loopsetb', function(data) {

  console.log(data.number);

  deckbloop = data;
  if ($('#deck2').hasClass('active') && loopbon) {
    loophighlight(data);
  }

});

socket.emit('screenheight', {
  height: $(window).height()
});

$('ul.tabs').each(function() {
  // For each set of tabs, we want to keep track of
  // which tab is active and it's associated content
  var $active, $content, $links = $(this).find('a');

  // If the location.hash matches one of the links, use that as the active tab.
  // If no match is found, use the first link as the initial active tab.
  $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
  $active.parent().addClass('activetab');

  $content = $($active[0].hash);

  // Hide the remaining content
  $links.not($active).each(function() {
    $(this.hash).hide();
  });

  // Bind the click event handler
  $(this).on('touchstart touchstart', 'a', function(e) {

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
$('#fxtoggle').toggles({});
if (flashing) {
  $('#flashingtoggle').toggles({
    on: true
  });
} else {
  $('#flashingtoggle').toggles({});
}
if (flashing) {
  $('#effectstoggle').toggles({
    on: true
  });
} else {
  $('#effectstoggle').toggles({});
}
$('#flashingtoggle').on('toggle', function(e, active) {
  if (active) {
    socket.emit('setting_flashing', {
      message: true
    });
    flashing = true;
  } else {
    socket.emit('setting_flashing', {
      message: false
    });
    $('#overlay').css('opacity', 0);
    flashing = false;
  }
});
$('#effectstoggle').on('toggle', function(e, active) {
  if (active) {
    socket.emit('setting_effects', {
      message: true
    });
    $('#xy').show();
  } else {
    socket.emit('setting_effects', {
      message: false
    });
    $('#xy').hide();
  }
});

var newwidth;

if ($(window).width() > 500) {
  newwidth = 500;
} else {
  newwidth = $(window).width();
}

if ($(window).height() < newwidth + 128 + 65) {
  $("#fx3").hide();
  $("#fx4").hide();
  $("#lower").hide();
}

if ($(window).height() > 500) {

}



$(".container").css("width", newwidth);
$(".quartbutton").css("width", ((newwidth / 4) - 9));
$(".halfbutton").css("width", ((newwidth / 2) - 6));
$(".footerbuttons").css("width", ((newwidth / 4 - 11.5)));
$(".site-footer").css("width", newwidth);
$("#buttongroup").css("width", newwidth)
var backgroundheight = $(window).height() - 120;
$(".swipearea").css("background-size", newwidth + 'px 500px');


$(".container").css("height", $(window).height() - 65);
$(".swipearea").css("height", $(window).height() - 65);
var remainingwidth = $(window).height() - 65 - newwidth;
console.log(remainingwidth);
if (remainingwidth < 110) {
  //$( "#fx1, #fx2" ).css( "height", (remainingwidth/2) - 20);
} else {
  //$( "#fx1, #fx2, #fx3, #fx4" ).css( "height", (remainingwidth/2) - 20);
}

$(".swipearea").css("height", $(window).height() - 30);
$(window).resize(function() {
  $(".container").css("height", $(window).height() - 65);
});

function scrollfalse() {
  scrolling = false;
}

$(".swipearea").on("touchend", function(ev) {
  setTimeout(scrollfalse, 200);
});

$(".swipearea").swipe({

  tap: function(event, target) {
    if (!scrolling) {
      socket.emit('browser');
    }
  },

  swipeLeft: function(event, direction, distance, duration, fingerCount) {
    socket.emit('loada');
    if (supportsVibrate) {
      navigator.vibrate(300);
    }
    $(".swipearea").css({
      'background-image': 'url(/images/decka.png)'
    });
    clearInterval(fadevar);
    fadevar = setTimeout(function() {
      $(".swipearea").css({
        'background-image': 'url(/images/scroll.png)'
      });
    }, 1000);
  },

  swipeRight: function(event, direction, distance, duration, fingerCount) {
    socket.emit('loadb');
    if (supportsVibrate) {
      navigator.vibrate(300);
    }
    $(".swipearea").css({
      'background-image': 'url(/images/deckb.png)'
    });
    clearInterval(fadevar);
    fadevar = setTimeout(function() {
      $(".swipearea").css({
        'background-image': 'url(/images/scroll.png)'
      });
    }, 1000);

  },


  swipeStatus: function(event, phase, direction, distance, duration, fingers) {



    var newdistance;


    newdistance = distance / 40;

    newdistance = Math.floor(newdistance);

    direction = direction;

    if (direction == null) {
      olddistance = 0;
    }

    if (direction == "down") {
      if (newdistance >= olddistance + 1) {
        olddistance = newdistance;
        socket.emit('menuup');

        scrolling = true;
      }

      if (newdistance <= olddistance - 1) {
        olddistance = newdistance;
        socket.emit('menudown');

        scrolling = true;
      }
    }

    if (direction == "up") {
      if (newdistance >= olddistance + 1) {
        olddistance = newdistance;
        socket.emit('menudown');

        scrolling = true;
      }

      if (newdistance <= olddistance - 1) {
        olddistance = newdistance;
        socket.emit('menuup');

        scrolling = true;
      }
    }


    if (phase == "cancel") olddistance = 0;
    if (phase == "end") olddistance = 0;

  },
  threshold: 40,
  maxTimeThreshold: 5000,
  fingers: 'all'
});
$("fieldset").hide();

if ($('#fx1').hasClass('active')) {
  fxval = 1;
} else {
  fxval = 2;
}