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


class CanvasEditor extends KonektiEditor{
	constructor(dictionary){
		super(dictionary)
		var id = this.id
		this.gui = Konekti.util.vc(id+'canvas')
		if( typeof dictionary.commands != 'undefined' ) this.commands = dictionary.commands
		else this.commands = {}
		this.wunit = 100
		if( typeof dictionary.wunit != 'undefined' ) this.wunit = dictionary.wunit
		this.hunit = 100
		if( typeof dictionary.hunit != 'undefined' ) this.hunit = dictionary.hunit
		this.units(this.wunit, this.hunit)
	}

	getContext(){ 
//		this.gui = Konekti.util.vc('canvas'+this.id)
		return this.gui.getContext('2d') 
	}

	clear(){ this.getContext().strokeRect(0,0,this.gui.width,this.gui.height) }

	redraw(){
		this.resize()
		this.draw(this.commands) 
	}

	resize(){
		var used = this.commands
		var ctx = this.getContext()
		ctx.canvas.width = this.gui.offsetWidth
		ctx.canvas.height = this.gui.offsetHeight
		var wC = ctx.canvas.width 
		var hC = ctx.canvas.height 
		var wU = this.wunit 
		var hU = this.hunit
		if( wC/wU < hC/hU ) this.scale = wC/wU; else this.scale = hC/hU
	}

	units(wunit, hunit){
		this.wunit = wunit
		this.hunit = hunit
		this.redraw()
	}

	// Drawing functions 
	image(obj){
		var img = Konekti.util.vc(obj.id)
		if( img==undefined || img==null ){
			img = component.new('img', obj.id)
			img.src = obj.src
			img.alt = 'Undefined'
		}   
     
		var rotate
		if( obj.rotate!=undefined && obj.rotate!=null && obj.rotate!=0 ) rotate = obj.rotate
		else rotate=0

		var s = this.scale

		var x = obj.x * s
		var y = obj.y * s
		var width = obj.width * s
		var height = obj.height * s

		var ctx = this.getContext()
	     
		if( rotate!=0 ){
			ctx.save()
			var rx = x + width/2
			var ry = y + height/2
			ctx.translate(rx, ry)
			ctx.rotate(rotate * Math.PI/2)
			ctx.drawImage(img, -width/2, -height/2, width, height)
			ctx.restore()
		}else ctx.drawImage(img, x, y, width, height)
	}

	compound(obj){
		var objs = obj.commands
		for( var i=0; i<objs.length; i++ ) this.draw(objs[i])
	}

	beginPath(obj){ this.getContext().beginPath() }

	closePath(obj){ this.getContext().closePath() }

	moveTo(obj){
		var ctx = this.getContext()
		var s = this.scale
		var x = obj.x * s
		var y = obj.y * s
		ctx.moveTo(x,y)
	}

	lineTo(obj){
		var ctx = this.getContext()
		var s = this.scale
		var x = obj.x * s
		var y = obj.y * s
		ctx.lineTo(x,y)
	}

	quadTo(obj){
		var ctx = this.getContext()
		var s = this.scale
		var cp1x = obj.x[0] * s
		var cp1y = obj.y[0] * s
		var x = obj.x[1] * s
		var y = obj.y[1] * s
		ctx.quadraticCurveTo(cp1x, cp1y, x, y) 
	}

	curveTo(obj){
		var ctx = this.getContext()
		var s = this.scale
		var cp1x = obj.x[0] * s
		var cp1y = obj.y[0] * s
		var cp2x = obj.x[1] * s
		var cp2y = obj.y[1] * s
		var x = obj.x[2] * s
		var y = obj.y[2] * s
		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
	}

	line(obj){
		this.beginPath(obj)
		this.moveTo({x:obj.x[0],y:obj.y[0]})
		this.lineTo({x:obj.x[1],y:obj.y[1]})
		this.stroke(obj)
	}

	poly(obj){
		this.beginPath(obj)
		var px = obj.x
		var py = obj.y
		this.moveTo({x:px[0],y:py[0]})
		for( var i=1; i<px.length; i++) this.lineTo({x:px[i],y:py[i]})
	}

	polyline(obj){
		this.poly(obj)
		this.stroke(obj)
	}

	polygon(obj){
		this.poly(obj)
		this.fill(obj)
	}

	style(obj){
		var canvas = Konekti.plugin.canvas
		if( obj.color != null )	return canvas.rgb(obj.color)
		if( obj.startcolor == null ) return null
		var c1 = canvas.rgb(obj.startcolor)
		var c2 = canvas.rgb(obj.endcolor)
		var s = this.scale
		var ctx = this.getContext()
		var gradient
		if( obj.r != null ){
			var r = obj.r * s
			var x = obj.x * s
			var y = obj.y * s
			gradient = ctx.createRadialGradient(x, y, 1, x, y, r)
		}else{
			var x1 = obj.x[0] * s
			var y1 = obj.y[0] * s
			var x2 = obj.x[1] * s
			var y2 = obj.y[1] * s
			gradient = ctx.createLinearGradient(x1, y1, x2, y2)
		}
		gradient.addColorStop("0", c1)
		gradient.addColorStop("1", c2)
		return gradient
	}

	strokeStyle(obj){
		var ctx = this.getContext() 
		ctx.strokeStyle = this.style(obj)
		if( obj.lineWidth != null ) ctx.lineWidth = obj.lineWidth
	}

	fillStyle(obj){
		var ctx = this.getContext()
		ctx.fillStyle = this.style(obj)
	}

	stroke(obj){ this.getContext().stroke() }

	fill(obj){
		var ctx = this.getContext()
		ctx.closePath()
		ctx.fill()
	}

	draw(obj){
		var type = obj.command
		if( type != null ) this[type](obj)
	}

	getText(){ return JSON.stringify(commands) }

	setText(txt){ 
		this.commands = JSON.parse(txt)
		this.redraw()
	}
}

// Canvas functions
Konekti.plugin.canvas.client = {}

Konekti.plugin.canvas.rgb = function( obj ){ return "rgb("+obj.red+","+obj.green+","+obj.blue+")"; }

Konekti.plugin.canvas.resize = function () {
	var canvas = Konekti.plugin.canvas
	for (var cc in canvas.client){
		canvas.client[cc].redraw()
	}
}
	
Konekti.plugin.canvas.connect = function ( dictionary ){
	Konekti.client[dictionary.client].editor(new CanvasEditor( dictionary))
} 
	
window.addEventListener("resize", Konekti.plugin.canvas.resize);

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
