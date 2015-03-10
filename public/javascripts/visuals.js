// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     ||  
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

var mousedown = true;


// Initialize the canvas first with 2d context like 
// we always do.
var canvas = document.getElementById("xy"),
	ctx = canvas.getContext("2d"),
	
	// Now get the height and width of window so that
	// it works on every resolution. Yes! on mobiles too.
	W = window.innerWidth,
	H = window.innerHeight;

// Set the canvas to occupy FULL space. We want our creation
// to rule, don't we?


if($(window).width() > 500){
	canvas.width = 500;
	canvas.height = 500;
}else{
	canvas.width = $(window).width();
	canvas.height = $(window).width();
}





canvas.addEventListener("touchstart",mouseDown, false);
canvas.addEventListener("touchmove",touchXY, false);
canvas.addEventListener("touchend",mouseUp, false);
canvas.addEventListener("mouseup",mouseUp, false);
canvas.addEventListener("mousedown",mouseDown, false);
canvas.addEventListener("mousemove",mouseXY, false);


// Some variables for later use
var circles = [],
	circlesCount = 7,
	mouse = {},
	mouseIsDown = false;

var circlesrendered = circlesCount;

// Every basic and common thing is done. Now we'll create
// a function which will paint the canvas black.
function paintCanvas() {
	
	// Default fillStyle is also black but specifying it
	// won't hurt anyone and we can change it back later.
	// If you want more controle over colors, then declare
	// them in a variable.
	var rgbx = Math.round((mouse.x/300)*255)
	var rgby = Math.round((mouse.y/300)*255)

	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "#03FFFB";
	if(mouseIsDown){
	ctx.fillStyle = "rgb("+ rgbx +","+ rgby +",0)";
}
	ctx.fillRect(0, 0, W, H);
}

// This will act as a class which we will use to create
// circle objects. Also, remember that class names are
// generally started with a CAPITAL letter and are 
// singular
function Circle() {
	this.x = Math.random() * W;
	this.y = Math.random() * H;
	
	this.radius = 100;
	
	this.r = Math.floor(Math.random() * 255);
	this.g = Math.floor(Math.random() * 255);
	this.b = Math.floor(Math.random() * 255);
	
	this.color = "rgb("+ this.r +", "+ this.g +", "+ this.b +")";
	
	this.draw = function() {
		ctx.globalCompositeOperation = "lighter";
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
	}
}

// Insert a random circle to the circles array.
for(var i = 0; i < circlesCount; i++) {
	circles.push(new Circle());
}

// A function that will be called in the loop, so
// consider it as the `main` function
function draw() {

	paintCanvas();

	for(i = 0; i < circlesCount; i++) {
		var c1 = circles[i],
			c2 = circles[i-1];

	
			if(false){
		circles[circles.length - 1].draw();
	}
		
		if(mouse.x && mouse.y) {
			circles[circles.length - 1].x = mouse.x;
			circles[circles.length - 1].y = mouse.y;

			if(i < circlesrendered){
			
 			c1.draw();

 		}
 		
		}
		
		if(i > 0) {
			c2.x += (c1.x - c2.x) * 0.1;
			c2.y += (c1.y - c2.y) * 0.1;
		}
}

if(!mouseIsDown){
	if(circlesrendered > 0){
	circlesrendered = circlesrendered - 1;
}
}



}

function mouseUp() {
	console.log("Mouse Up!")
	mouseIsDown = false;
	circlesrendered = 0;
}
 
function touchUp() {
}
 
function mouseDown() {
	console.log('Mouse Down!');
    mouseIsDown = true;
    circlesrendered = circlesCount;
    console.log(circlesrendered);
}
 
function touchDown() {
    mouseIsDown = true;
    touchXY();
}

function mouseXY(e) {
    e.preventDefault();
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}
 
function touchXY(e) {
    e.preventDefault();
    mouse.x = e.targetTouches[0].pageX - canvas.offsetLeft;
    mouse.y = e.targetTouches[0].pageY - canvas.offsetTop;
    numtouches = e.targetTouches.length;
    console.log("Number of touches: " + numtouches);
    if(numtouches == 2){
    	alert(numtouches);
    }
}

// The loop
function animloop() {
    draw();
  
	requestAnimFrame(animloop);

}
animloop();

$( "body" ).mouseup(function() {
  socket.emit('fx_on',{value: false});
  paintCanvas();
  mouseIsDown = false;
});



