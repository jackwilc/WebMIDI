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

var canvas = document.getElementById("xy");

var offscreenCanvas = document.createElement('canvas');

	W = window.innerWidth,
	H = window.innerHeight;

if($(window).width() > 500){
	canvas.width = 500;
	canvas.height = 500;

}else{
	canvas.width = $(window).width();
	canvas.height = $(window).width();

}

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

var ctx = canvas.getContext("2d");

var ctxMain = canvas.getContext('2d');

canvas.addEventListener("touchstart",mouseDown, false);
canvas.addEventListener("touchmove",touchXY, false);
canvas.addEventListener("touchend",mouseUp, false);
canvas.addEventListener("mouseup",mouseUp, false);
canvas.addEventListener("mousedown",mouseDown, false);
canvas.addEventListener("mousemove",mouseXY, false);

var circles = [],
	circlesCount = 7,
	mouse = {},
	mouseIsDown = false;

var circlesrendered = circlesCount;

function paintCanvas() {
	
	var rgbx = Math.round((mouse.x/canvas.width)*255);
	var rgby = Math.round((mouse.y/canvas.height)*255);

	ctx.globalCompositeOperation = "source-over";

	if(mouseIsDown){
	var rgbz = pulse.pulse() * 255;

	if(!flashing){
		rgbz = 100;
	}

	if(rgbz > 255){
		rgbz = 255;
	}

	rgbz = Math.floor(rgbz);
	ctx.fillStyle = "rgb("+ rgbx +","+ rgby +", " + rgbz + ")";

	ctx.fillRect(0, 0, W, H);

}else{

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var textx = canvas.width / 2;
    var texty = canvas.height / 2;
    var fontsize = 36 + (pulse.pulse() * 2)
	ctx.font= fontsize + "px Arial";
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.textAlign = 'center';
	ctx.fillText("TOUCH ME!" ,textx,texty);
}
	//ctx.fillRect(0, 0, W, H);
}

function Circle() {
	this.x = Math.random() * W;
	this.y = Math.random() * H;
	
	this.r = Math.floor(Math.random() * 255);
	this.g = Math.floor(Math.random() * 255);
	this.b = Math.floor(Math.random() * 255);
	
	this.color = "rgb("+ this.r +", "+ this.g +", "+ this.b +")";
	
	this.draw = function() {
		ctx.globalCompositeOperation = "lighter";
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, 90 + (pulse.pulse() * 40), 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
	}
}


for(var i = 0; i < circlesCount; i++) {
	circles.push(new Circle());
}

function draw() {

	paintCanvas();

	

	for(i = 0; i < circlesCount; i++) {
		var c1 = circles[i],
			c2 = circles[i-1];

	
			
		
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

if(lock){
		var textx = canvas.width / 2;
	ctx.fillStyle="#FFFFFF";
	ctx.font = (20 + pulse.pulse() * 5) + "px Arial";
	ctx.textAlign = 'center';
	ctx.fillText("LOCKED",textx,40);
}
if(!mouseIsDown){
	if(circlesrendered > 0){
	circlesrendered = circlesrendered - 1;
}
}


}

function mouseUp(e) {

	if(e.touches.length == 0 && !lock){
	mouseIsDown = false;
	circlesrendered = 0;
}
}
 
function touchUp() {
}
 
function mouseDown(e) {
	
    mouseIsDown = true;
    circlesrendered = circlesCount;
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;

}
 
function touchDown(e) {
    mouseIsDown = true;
    circlesrendered = circlesCount;
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
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
 
}

function animloop() {

    draw();

  
	requestAnimFrame(animloop);

}
animloop();

$( "body" ).mouseup(function() {
  //socket.emit('fx_on',{value: false});
  paintCanvas();
  //mouseIsDown = false;
});



