/**
*
* canvas.js
* <P>A basic drawing canvas  
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

// Canvas functions
var canvas = window.plugin.canvas

commandsByCanvas = {}

canvas.clear = function ( id ){
	var c, ctx, w, h;
	c = Util.vc(id);
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	ctx.strokeRect(0,0,w,h);
}
	
canvas.redraw = function (id){
	if( id==null ) for( id in commandsByCanvas) canvas.redraw(id)
	else canvas.command(id, commandsByCanvas[id].command)
}
	
canvas.scale = function ( id ){
	var used = commandsByCanvas[id]
	var container = Util.vc(id)
	var ctx = canvas.getContext(id)
	ctx.canvas.width = container.offsetWidth
	ctx.canvas.height = container.offsetHeight
	var wC = ctx.canvas.width 
	var hC = ctx.canvas.height 
	var wU = used.wunit 
	var hU = used.hunit
	if( wC/wU < hC/hU ) used.scale = wC/wU; else used.scale = hC/hU
}
	
canvas.resize = function () {
	for (var id in commandsByCanvas){
		canvas.scale(id)
		canvas.redraw(id)
	}
}
	
canvas.getContext = function ( id ){
	var c = Util.vc('canvas'+id)
	return c.getContext("2d");
}

canvas.units = function( id, wunit, hunit ){
	commandsByCanvas[id].wunit = wunit
	commandsByCanvas[id].hunit = hunit
	canvas.scale(id)
	canvas.redraw(id)
}

canvas.connect = function ( dictionary ){
	var id = dictionary.id
	commandsByCanvas[id] = { wunit:(dictionary.wunit!=null)?dictionary.wunit:100, hunit:(dictionary.hunit!=null)?dictionary.hunit:100 }
} 
	
// Drawing functions 

canvas.image = function ( id, obj ){
	var img = Util.vc(obj.id);
	if( img==undefined || img==null ){
		img = component.new('img', obj.id);
		img.src = obj.src;
		img.alt = 'Undefined';
	}   
     
	var rotate
	if( obj.rotate!=undefined && obj.rotate!=null && obj.rotate!=0 ) rotate = obj.rotate;
	else rotate=0;

	var s = commandsByCanvas[id].scale;

	var x = obj.x * s;
	var y = obj.y * s;
	var width = obj.width * s;
	var height = obj.height * s;

	var ctx = canvas.getContext( id );	
     
	if( rotate!=0 ){
		ctx.save(); 
 
		var rx = x + width/2;
		var ry = y + height/2;
		ctx.translate(rx, ry);

		ctx.rotate(rotate * Math.PI/2);
 
		ctx.drawImage(img, -width/2, -height/2, width, height);
 
		ctx.restore();      
	}else ctx.drawImage(img, x, y, width, height);
}

canvas.compound = function (id, obj){
	var objs = obj.commands;
	for( var i=0; i<objs.length; i++ ) canvas.command( id, objs[i] );
}

canvas.beginPath = function (id, obj){ canvas.getContext( id ).beginPath(); }

canvas.closePath = function (id, obj){ canvas.getContext( id ).closePath(); }

canvas.moveTo = function (id, obj){
	var ctx = canvas.getContext( id ); 
	var s = commandsByCanvas[id].scale;
	var x = obj.x * s;
	var y = obj.y * s;
	ctx.moveTo(x,y);
}

canvas.lineTo = function (id, obj){
	var ctx = canvas.getContext( id ); 
	var s = commandsByCanvas[id].scale;
	var x = obj.x * s;
	var y = obj.y * s;
	ctx.lineTo(x,y);
}

canvas.quadTo = function ( id, obj ){
	var ctx = canvas.getContext( id ); 
	var s = commandsByCanvas[id].scale;
	var cp1x = obj.x[0] * s;
	var cp1y = obj.y[0] * s;
	var x = obj.x[1] * s;
	var y = obj.y[1] * s;
	ctx.quadraticCurveTo(cp1x, cp1y, x, y); 
}

canvas.curveTo = function ( id, obj ){
	var ctx = canvas.getContext( id ); 
	var s = commandsByCanvas[id].scale;
	var cp1x = obj.x[0] * s;
	var cp1y = obj.y[0] * s;
	var cp2x = obj.x[1] * s;
	var cp2y = obj.y[1] * s;
	var x = obj.x[2] * s;
	var y = obj.y[2] * s;
	ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); 
}

canvas.line = function( id, obj ){
	canvas.beginPath(id, obj);
	canvas.moveTo(id, {x:obj.x[0],y:obj.y[0]});
	canvas.lineTo(id, {x:obj.x[1],y:obj.y[1]});
	canvas.stroke(id,obj);
}

canvas.poly = function( id, obj ){
	canvas.beginPath(id, obj);
	var px = obj.x;
	var py = obj.y;
	canvas.moveTo(id, {x:px[0],y:py[0]});
	for( var i=1; i<px.length; i++) canvas.lineTo(id, {x:px[i],y:py[i]});		
}

canvas.polyline = function( id, obj ){
	canvas.poly(id, obj);
	canvas.stroke(id,obj);
}

canvas.polygon = function( id, obj ){
	canvas.poly(id, obj);
	canvas.fill(id,obj);
}

canvas.rgb = function( obj ){ return "rgb("+obj.red+","+obj.green+","+obj.blue+")"; }

canvas.style = function( id, obj ){
	if( obj.color != null )	return canvas.rgb(obj.color);
	if( obj.startcolor == null ) return null;
	var c1 = canvas.rgb(obj.startcolor);
	var c2 = canvas.rgb(obj.endcolor);
	var s = commandsByCanvas[id].scale;
	var ctx = canvas.getContext( id );
	var gradient
	if( obj.r != null ){
		var r = obj.r * s;
		var x = obj.x * s;
		var y = obj.y * s;
		gradient = ctx.createRadialGradient(x, y, 1, x, y, r);
	}else{
		var x1 = obj.x[0] * s;
		var y1 = obj.y[0] * s;
		var x2 = obj.x[1] * s;
		var y2 = obj.y[1] * s;
		gradient = ctx.createLinearGradient(x1, y1, x2, y2);	
	}
	gradient.addColorStop("0", c1);			
	gradient.addColorStop("1", c2);
	return gradient;
}

canvas.strokeStyle = function( id, obj ){
	var ctx = canvas.getContext( id ); 
	ctx.strokeStyle = canvas.style(id, obj);
	if( obj.lineWidth != null ) ctx.lineWidth = obj.lineWidth;
}

canvas.fillStyle = function( id, obj ){
	var ctx = canvas.getContext( id ); 
	ctx.fillStyle = canvas.style(id, obj);
}

canvas.stroke = function( id, obj ){ canvas.getContext( id ).stroke(); }

canvas.fill = function( id, obj ){
	var ctx = canvas.getContext( id );
	ctx.closePath();
	ctx.fill(); 
}

canvas.command = function ( id, obj ){
	var type = obj.command;
	if( type != null ) canvas[type](id, obj);
}

canvas.draw = function ( id, objText ){
	var json = JSON.parse(objText); 
	if( json.wunit != null ) commandsByCanvas[id] = json
	else commandsByCanvas[id].command = json
	canvas.scale(id)
	canvas.command(id, commandsByCanvas[id].command); 
}

window.addEventListener("resize", canvas.resize);

/*

function arc( ctx, centerX, centerY, radius, startAngle, endAngle ){
	ctx.arc( centerX, centerY, radius, startAngle*Math.PI/180, endAngle*Math.PI/180, startAngle > endAngle ); 
}

function fillRect( ctx, x, y, width, height, color ){
	fill( ctx, color );
	ctx.fillRect(x, y, width, height); 
}

function rect( ctx, x, y, width, height ){ ctx.strokeRect(x, y, width, height); }

function ring( ctx, x, y, radius, thickness, startAngle, endAngle ){
	ctx.beginPath();
	arc( ctx, x, y, radius, startAngle, endAngle );
	arc( ctx, x, y, radius-thickness, endAngle, startAngle );
	ctx.closePath();
}

function fillRing( ctx, x, y, radius, thickness, startAngle, endAngle, color ){
	ring( ctx, x, y, radius, thickness, startAngle, endAngle );
	fill( ctx, color );
}

//Drawing commands as JSON objects
function drawArc( canvasId, obj ){
	s = canvas.set[canvasId].scale;
	ctx = getContext( canvasId );	
	ctx.beginPath();
	x = obj.x * s;
	y = obj.y * s;
	radius = obj.radius * s;
	arc( ctx, x, y, radius, obj.start, obj.end);
	stroke( ctx, obj.color );
}

function drawRect( canvasId, obj ){
	s = canvas.set[canvasId].scale;
	ctx = getContext( canvasId );	
	stroke( ctx, obj.color );
	x = obj.x * s;
	y = obj.y * s;
	width = obj.width * s;
	height = obj.height * s;
	rect( ctx, x, y, width, height );
}

function drawFillRect( canvasId, obj ){
	s = canvas.set[canvasId].scale;
	ctx = getContext( canvasId );	
	fill( ctx, obj.color );
	x = obj.x * s;
	y = obj.y * s;
	width = obj.width * s;
	height = obj.height * s;
	fillRect( ctx, x, y, width, height );
}

function drawRing( canvasId, obj ){
	s = canvas.set[canvasId].scale;
	x = scale(obj.x, s);
	y = scale(obj.y, s);
	radius = scale(obj.radius, s);
	thickness = scale(obj.thickness, s);
	ctx = getContext( canvasId );	
	ring( ctx, x, y, radius, thickness, obj.start, obj.end );
	stroke(ctx, obj.color);
}

function drawFillRing( canvasId, obj ){
	s = canvas.set[canvasId].scale;
	x = scale(obj.x, s);
	y = scale(obj.y, s);
	radius = scale(obj.radius, s);
	thickness = scale(obj.thickness, s);
	ctx = getContext( canvasId );	
	fillRing( ctx, x, y, radius, thickness, obj.start, obj.end, obj.color );
}
*/


/*
<div class="w3-container"> 
		<div id="JScanvas" style="position:relative; width:100%; padding-bottom:56.25%; height:0" >
			<div id="JScanvas-inner" style="position:absolute; width:100%; height:100%; top:0; left:0" >
				<canvas id="myCanvas" style="position:absolute; top:0; left:0; border:1px solid #d3d3d3">
			</div>
		</div>
  <h2>With a Container</h2>
  <p>The w3-container class is one of the most important W3.CSS classes.</p>
  <p>It provides correct margins, padding, alignments, and more, to most HTML elements.</p>
</div>
<script>
function myFunction(){
	var w = document.getElementById("JScanvas");
    var width = w.offsetWidth
    var height = w.offsetHeight
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
    ctx.canvas.width = width
    ctx.canvas.height = height
	ctx.moveTo(0,0);
	ctx.lineTo(0.5*ctx.canvas.width,0.5*ctx.canvas.height);
	ctx.stroke();
}    

</script>
*/
