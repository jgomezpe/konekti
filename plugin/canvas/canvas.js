/** Canvas Editor */
class CanvasEditor extends KonektiEditor{
	/**
	 * Creates a CanvasEditor
	 * @param thing Canvas configuration
	 */
	constructor(thing){
		super(thing)
		this.gui = this.vc('-canvas')
		this.custom_commands(thing.custom)
		this.commands = thing.commands || {}
		Konekti.plugin.canvas.render[this.id] = this
		this.redraw()
	}
	
	/**
	 * Sets the custom commands of the canvas
	 * @param custom Custom commands
	 */
	custom_commands( custom ){
		this.custom = {}
		if( custom !== undefined ){
			for( var i=0; i<custom.commands.length; i++ ){
	        		this.custom[custom.commands[i].command] = custom.commands[i]
			}
		}
	}

	/**
	 * Gets the context of the canvas
	 * @return context of the command
	 */	
	getContext(){  return this.gui.getContext('2d') }

	/**
	 * Cleans the canvas
	 */
	clear(){ 
		this.commands = {}
		this.getContext().strokeRect(0,0,this.gui.width,this.gui.height) 
	}

	/**
	 * Redraws the canvas
	 */
	redraw(){
		this.resize()
		this.draw(this.commands) 
	}
	
	/**
	 * Scales the inner commands of a compound command
	 * @param obj Compound command
	 * @param sx Scaling factor for the x coordinate
	 * @param sy Scaling factor for the y coordinate
	 * @return A scaled version of the command
	 */
	inner_scale( obj, sx, sy ){
		var c = this.copy(obj)
		if( typeof obj.commands !== 'undefined' ){
			var commands = []
			for(var i=0; i<obj.commands.length; i++ ) 
				commands[i] = this.inner_scale(obj.commands[i],sx,sy)
			c.commands = commands
		}
		if( typeof obj.x !== 'undefined' ){
			if( Array.isArray(obj.x) ){
				var nx = []
				var ny = []
				for(var i=0; i<obj.x.length; i++){
					nx.push(obj.x[i]*sx)
					ny.push(obj.y[i]*sy)
				}
				c.x = nx
				c.y = ny
			}else{
				c.x = obj.x * sx
				c.y = obj.y * sy
			}
		}    
		return c
	}
	
	/**
	 * Applies a scale command
	 * @param obj Scale command. It is defined by attributes:
	 * <i>command='scale'</i>, 
	 * <i>x</i> x coordinate scale, and
	 * <i>y</i> y coordinate scale 
	 * @return A scaled version of the command
	 */
	scale( obj ){
		obj.command = 'compound'
		var sx = obj.x
		var sy = obj.y
		var nobj = this.inner_scale(obj,sx,sy)
		obj.x = sx
		obj.y = sy
		obj.command = 'scale'
		return nobj
	}

	/**
	 * Translates the inner commands of a compound command
	 * @param obj Compound command
	 * @param sx Translation delta for the x coordinate
	 * @param sy Translation delta for the y coordinate
	 * @return A translated version of the command
	 */
	inner_translate( obj, dx, dy ){
	    var c = this.copy(obj)
		if( typeof obj.commands !== 'undefined' ){
		    var commands = []
			for(var i=0; i<obj.commands.length; i++ ) 
                commands[i] = this.inner_translate(obj.commands[i],dx,dy)
			c.commands = commands
		}
		if( typeof obj.x !== 'undefined' ){
            if( Array.isArray(obj.x) ){
                var nx = []
                var ny = []
                for(var i=0; i<obj.x.length; i++){
                    nx.push(obj.x[i]+dx)
                    ny.push(obj.y[i]+dy)
                }    
                c.x = nx
                c.y = ny
            }else{
                c.x = obj.x + dx
                c.y = obj.y + dy
            }
		}    
		return c
	}
	
	/**
	 * Applies a translation command
	 * @param obj Translation command. It is defined by attributes: 
	 * <i>command='translation'</i>, 
	 * <i>x</i> x coordinate delta, and 
	 * <i>y</i> y coordinate delta 
	 * @return A translated version of the command
	 */
	translate( obj ){
        obj.command = 'compound'
        var x = obj.x
        var y = obj.y
        var nobj = this.inner_translate(obj,x,y)
        obj.x = x
        obj.y = y
        obj.command = 'translate'
        return nobj
	}

	/**
	 * Computes the angle defined by two points <i>(x1,y1), (x2,y2)</i> (order preserved) 
	 * @param x1 x coordinate of the first (origin) point
	 * @param y1 y coordinate of the first (origin) point
	 * @param x2 x coordinate of the second (target) point
	 * @param y2 y coordinate of the second (target) point
	 * @return Angle defined by points <i>(x1,y1), (x2,y2)</i> (order preserved)
	 */
	angle( x1, y1, x2, y2 ){
		var a = (x2-x1) 
		var b = (y2-y1)
		var r = Math.sqrt(a*a+b*b)
		if( r>1e-6 ){
			var alpha = Math.acos(a/r)
			if( b<0 ) alpha = 2.0*Math.PI - alpha
			return alpha
		}else return 0.0
	}
	
	/**
	 * Rotates point <i>(px,py)</i> the given angle having as center of rotation point <i>(cx,cy)</i> 
	 * @param cx x coordinate of the center of rotation
	 * @param cy y coordinate of the center of rotation
	 * @param px x coordinate of the point to rotate
	 * @param py y coordinate of the point to rotate
	 * @param angle Rotation angle
	 * @return Rotated point
	 */
	rotate_point( cx, cy, px, py, angle ){
		var alpha = this.angle( cx, cy, px, py ) + angle
		if( alpha>1e-6 ){
			var a = (px-cx)
            var b = (py-cy)
			var r = Math.sqrt(a*a+b*b)
			return [cx + r*Math.cos(alpha), cy + r*Math.sin(alpha)]
		}else return [px,py]			
	}
	
	/**
	 * Rotates the inner commands of a compound command
	 * @param obj Compound command
	 * @param cx x coordinate of the rotation center
	 * @param cy y coordinate of the rotation center
	 * @param angle Rotation angle
	 * @return A rotated version of the command
	 */
	inner_rotate( obj, cx, cy, angle ){
		var c = this.copy(obj)
		if( typeof obj.commands !== 'undefined' ){
			var commands = []
			for(var i=0; i<obj.commands.length; i++ ) 
    			commands[i] = this.inner_rotate(obj.commands[i],cx,cy,angle)
			c.commands = commands
		}
		if( obj.command == 'image' ) c.r = obj.r + angle
		else{
			var p
    		if( typeof obj.x !== 'undefined' ){
				if( Array.isArray(obj.x) ){
					var nx = []
					var ny = []
					for(var i=0; i<obj.x.length; i++){
						p = this.rotate_point( cx, cy, obj.x[i], obj.y[i], angle )
						nx.push(p[0])
						ny.push(p[1])
					}    
					c.x = nx
					c.y = ny
				}else{
					p = this.rotate_point( cx, cy, obj.x, obj.y, angle )
					c.x = p[0]
					c.y = p[1]
				}
			}    
		}
		return c
	}
	
	/**
	 * Applies a rotation command
	 * @param obj Rotation command.It is defined by attributes:
	 * <i>command='rotate'</i>,
	 * <i>r</r> rotation angle,
	 * <i>x</i> x coordinate of the rotation center, and
	 * <i>y</i> y coordinate of the rotation center 
	 * @return A rotated version of the command
	 */
	rotate( obj ){
		obj.command = 'compound'
		var x = obj.x
		var y = obj.y
		var a = obj.r
		var nobj = this.inner_rotate(obj,x,y,a)
		obj.x = x
		obj.y = y
		obj.r = a
		obj.command = 'rotate'
		return nobj
	}
	
	/**
	 * Applies a fit command (scales unit to container's component size)
	 * @param obj Fit command. It is defined by attributes:
	 * <i>command='fit'</i>,
	 * <i>r</r> a boolean indicating if keeping aspect ratio or not,
	 * <i>x</i> x coordinate unit, and
	 * <i>y</i> y coordinate unit  
	 * @return A fitted version of the command
	 */
	fit( obj ){
		var c = this.copy(obj)
		c.command = 'scale'
		var x = obj.x
		var y = obj.y
		var keepAspectRatio = obj.r
		var w = this.gui.offsetWidth
		var h = this.gui.offsetHeight
		if(keepAspectRatio) {
			var s
			if( w*x < h*y ) s = w*x
			else s = h*y
			x = s
			y = s
		}else {
			x *= w
			y *= h
		}
		c.x = x
		c.y = y
		c.commands = obj.commands
		return this.scale(c)
	}

	/**
	 * Resizes commands according to client container's size
	 */
	resize(){
		var used = this.commands
		var ctx = this.getContext()
		ctx.canvas.width = this.gui.offsetWidth
		ctx.canvas.height = this.gui.offsetHeight
	}

	/**
	 * Draws an image
	 * @param obj Image to draw. It is defined by attributes:
	 * <i>command='image'</i>, <i>id</i> image identifier,
	 * <i>src</i> URL of the image,
	 * <i>r</i> rotation angle in r*pi/2 values (r must be an integer value),
	 * <i>x</i> x coordinate of the rotation center, 
	 * <i>y</i> y coordinate of the rotation center,
	 * <i>width</i> Width of the image, and
	 * <i>height</i> height of the image. 
	 */
	image(obj){
		var img = Konekti.vc(obj.id)
		if( img==undefined || img==null ){
			img = component.new('img', obj.id)
			img.src = obj.src
			img.alt = 'Undefined'
		}   
     
		var rotate = obj.r || 0.0

		var x = obj.x 
		var y = obj.y 
		var width = obj.width 
		var height = obj.height

		var ctx = this.getContext()
	     
		if( rotate!=0.0 ){
			ctx.save()
			var rx = x + width/2
			var ry = y + height/2
			ctx.translate(rx, ry)
			ctx.rotate(rotate * Math.PI/2)
			ctx.drawImage(img, -width/2, -height/2, width, height)
			ctx.restore()
		}else ctx.drawImage(img, x, y, width, height)
	}

	/**
	 * Draws a compound command
	 * @param obj Compound command. It is defined by attributes:
	 * <i>command='compound'</i>, and 
	 * <i>commands</i> an array of commands. 
	 */
	compound(obj){
		var objs = obj.commands
		for( var i=0; i<objs.length; i++ ) this[objs[i].command](objs[i])
	}

	/**
	 * Stats a path
	 * @param obj Begin path command. It is defined by attribute:
	 * <i>command='beginPath'</i>. 
	 */
	beginPath(obj){ this.getContext().beginPath() }

	/**
	 * Closes a path
	 * @param obj Close path command. It is defined by attribute: <i>command='closePath'</i>. 
	 */
	closePath(obj){ this.getContext().closePath() }

	/**
	 * Moves the drawing cursor to a given position.
	 * @param obj Move to command. It is defined by attributes:
	 * <i>command='moveTo'</i>,
	 * <i>x</i> x coordinate to move the drawing cursor, 
	 * <i>y</i> y coordinate to move the drawing cursor. 
	 */
	moveTo(obj){
		var ctx = this.getContext()
		var x = obj.x 
		var y = obj.y
		ctx.moveTo(x,y)
	}

	/**
	 * Draws a line from the given drawing cursor's position to the given one.
	 * @param obj Line to command. It is defined by attributes:
	 * <i>command='lineTo'</i>,
	 * <i>x</i> Final x coordinate of the line, 
	 * <i>y</i> Final y coordinate of the line. 
	 */
	lineTo(obj){
		var ctx = this.getContext()
		var x = obj.x
		var y = obj.y
		ctx.lineTo(x,y)
	}

	/**
	 * Draws a quadratic curve from the given drawing cursor's position using the given control points.
	 * @param obj Quadratic to command. It is defined by attributes:
	 * <i>command='quadTo'</i>, 
	 * <i>x</i> an array with the x coordinates of the control point and final point of the cuadratic curve, and 
	 * <i>y</i> an array with the y coordinates of the control point and final point of the cuadratic curve. 
	 */
	quadTo(obj){
		var ctx = this.getContext()
		var cp1x = obj.x[0] 
		var cp1y = obj.y[0]
		var x = obj.x[1]
		var y = obj.y[1]
		ctx.quadraticCurveTo(cp1x, cp1y, x, y) 
	}

	/**
	 * Draws a Bezier curve from the given drawing cursor's position using the given control points.
	 * @param obj Curve to command. It is defined by attributes:
	 * <i>command='curveTo'</i>, 
	 * <i>x</i> an array with the x coordinates of two controls points and final point of the Bezier curve, and 
	 * <i>y</i> an array with the y coordinates of two controls points and final point of the Bezier curve. 
	 */
	curveTo(obj){
		var ctx = this.getContext()
		var cp1x = obj.x[0] 
		var cp1y = obj.y[0]
		var cp2x = obj.x[1]
		var cp2y = obj.y[1]
		var x = obj.x[2]
		var y = obj.y[2]
		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
	}

	/**
	 * Draws a line using the given control points.
	 * @param obj Line command. It is defined by attributes:
	 * <i>command='line'</i>, 
	 * <i>x</i> an array with the x coordinates of the initial and final point of the line, and 
	 * <i>y</i> an array with the y coordinates of the initial and final point of the line. 
	 */
	line(obj){
		this.beginPath(obj)
		this.moveTo({x:obj.x[0],y:obj.y[0]})
		this.lineTo({x:obj.x[1],y:obj.y[1]})
		this.stroke(obj)
	}

	/**
	 * Defines a polyline object (polyline or polygon) according to the given control points.
	 * @param obj poly command. It is defined by attributes:
	 * <i>x</i> an array with the x coordinates of the polyline object, and 
	 * <i>y</i> an array with the y coordinates of polyline object. 
	 */
	poly(obj){
		this.beginPath(obj)
		var px = obj.x
		var py = obj.y
		this.moveTo({x:px[0],y:py[0]})
		for( var i=1; i<px.length; i++) this.lineTo({x:px[i],y:py[i]})
	}

	/**
	 * Draws a polyline according to the given control points.
	 * @param obj poly command. It is defined by attributes:
	 * <i>command='polyline'</i>,
	 * <i>x</i> an array with the x coordinates of the polyline, and 
	 * <i>y</i> an array with the y coordinates of polyline. 
	 */
	polyline(obj){
		this.poly(obj)
		this.stroke(obj)
	}

	/**
	 * Draws a polygon according to the given control points.
	 * @param obj poly command. It is defined by attributes:
	 * <i>command='polygon'</i>,
	 * <i>x</i> an array with the x coordinates of the polygon, and 
	 * <i>y</i> an array with the y coordinates of polygon. 
	 */
	polygon(obj){
		this.poly(obj)
		this.fill(obj)
	}

	/**
	 * Creates a string version of a color (rgba)
	 * @param obj poly command. It is defined by attributes:
	 * <i>command='rgba'</i>,
	 * <i>red</i> red component of the color,
	 * <i>green</i> green component of the color,
	 * <i>blue</i> blue component of the color,
	 * <i>alpha</i> alpha component of the color
	 */
    rgba( obj ){ return "rgba("+obj.red+","+obj.green+","+obj.blue+","+obj.alpha+")"; }

	/**
	 * Applies and returns a drawing style
	 * @param obj Drawing style. It is defined by attributes:
	 * <i>startcolor</i> Start color if a gradient style is defined,
	 * <i>endcolor</i> End color if a gradient style is defined,
	 * <i>r</i> Radius of the radial gradient if defined,
	 * <i>x</i> x coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient,
	 * <i>y</i> y coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient, and
	 * <i>r</i> Radius of the radial gradient if defined
	 * @return A drawing style
	 */
	style(obj){
		if( obj.color != null )	return this.rgba(obj.color)
		if( obj.startcolor == null ) return null
		var c1 = this.rgba(obj.startcolor)
		var c2 = this.rgba(obj.endcolor)
		var ctx = this.getContext()
		var gradient
		if( obj.r != null ){
			var r = obj.r
			var x = obj.x 
			var y = obj.y
			gradient = ctx.createRadialGradient(x, y, 1, x, y, r)
		}else{
			var x1 = obj.x[0] 
			var y1 = obj.y[0] 
			var x2 = obj.x[1] 
			var y2 = obj.y[1] 
			gradient = ctx.createLinearGradient(x1, y1, x2, y2)
		}
		gradient.addColorStop("0", c1)
		gradient.addColorStop("1", c2)
		return gradient
	}

	/**
	 * Applies a stroke style
	 * @param obj Stroke style. It is defined by attributes:
	 * <i>startcolor</i> Start color if a gradient style is defined,
	 * <i>endcolor</i> End color if a gradient style is defined,
	 * <i>r</i> Radius of the radial gradient if defined,
	 * <i>x</i> x coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient,
	 * <i>y</i> y coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient,
	 * <i>r</i> Radius of the radial gradient if defined, and
	 * <i>lineWidth</i> Line width of the stroke style
	 */
	strokeStyle(obj){
		var ctx = this.getContext() 
		ctx.strokeStyle = this.style(obj)
		if( obj.lineWidth != null ) ctx.lineWidth = obj.lineWidth
	}

	/**
	 * Applies a fill style
	 * @param obj Fill style. It is defined by attributes:
	 * <i>command='fillStyle'</i>,
	 * <i>startcolor</i> Start color if a gradient style is defined,
	 * <i>endcolor</i> End color if a gradient style is defined,
	 * <i>r</i> Radius of the radial gradient if defined,
	 * <i>x</i> x coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient,
	 * <i>y</i> y coordinate of the center of the radial gradient or an array with the coordinates of the line defining the linear gradient, and
	 * <i>r</i> Radius of the radial gradient if defined.
	 */
	fillStyle(obj){
		var ctx = this.getContext()
		ctx.fillStyle = this.style(obj)
	}

	/** 
	 * Starts a stroke drawing
	 * @param obj Stroke command. It is defined by attribute:
	 * <i>command='stroke'</i>
	 */
	stroke(obj){ this.getContext().stroke() }

	/** 
	 * Starts a fill drawing
	 * @param obj Fill command. It is defined by attribute:
	 * <i>command='fill'</i>
	 */
	fill(obj){
		var ctx = this.getContext()
		ctx.closePath()
		ctx.fill()
	}
	
	/**
	 * Creates a hard copy of the command
	 * @param c Command to clone
	 * @return A hard copy of the command
	 */
	copy(c){
	    var cc = {}
	    for( var x in c ){
	        cc[x] = c[x]
	    }
	    return cc 
	}

	/**
	 * Initializes the command for drawing it in the canvas
	 * @param c Command to be initialized
	 * @return An initialized version of the command
	 */
	init_command( c ) {
	    if(typeof c.command === 'undefined') return c
	    var cc = this.custom[c.command]
	    if( typeof cc !== 'undefined' ) {
		    c = this.copy(cc)
		    c.command = 'compound'
	    }

	    if(typeof c.commands !=='undefined') {
	        c = this.copy(c)
	        var obj = []
	        for(var i=0; i<c.commands.length; i++)
                obj.push(this.init_command(c.commands[i]))
            c.commands = obj
	    }
	    
	    if(c.command === 'translate' )	return this.translate(c)
	    if(c.command === 'rotate' )	return this.rotate(c)
	    if(c.command === 'scale' )	return this.scale(c)
	    if(c.command === 'fit' )	return this.fit(c)
	    return c
	}

	/**
	 * Draws a command
	 * @param Command to draw
	 */
	draw(obj){
		obj = this.init_command(obj)
		var type = obj.command
		if( type !== null ) this[type](obj)
	}

	/**
	 * Gets the drawing commands in text format
	 * @return A stringify representation of the commands drawn by the canvas
	 */
	getText(){ return JSON.stringify(commands) }

	/**
	 * Sets the drawing commands in text format
	 * @param text A stringify representation of the commands to be drawn by the canvas
	 */
	setText(txt){ 
		this.commands = JSON.parse(txt)
		this.redraw()
	}
}

/** Konekti Plugin for canvas */
class KonektiCanvasPlugIn extends KonektiPlugIn{
	/** Creates a Plugin for canvas */
	constructor(){ 
		super('canvas') 
		this.render = {}
	}

	/**
	 * Resizes all the canvas that have beien registered
	 */
	resize(){
		var canvas = Konekti.plugin.canvas
		for (var cc in canvas.render){
			canvas.render[cc].redraw()
		}
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new CanvasEditor(thing) } 
}

new KonektiCanvasPlugIn()

window.addEventListener("resize", Konekti.plugin.canvas.resize)

/**
 * @function
 * Konekti canvas
 * @param id Id/Configuration of the canvas
 * @param initial Initial set of commands to run (as JSON object or stringify object)
 * @param custom_commands Custom commands for the canvas (as JSON object or stringify object)
 */
Konekti.canvas = function(id, initial={}, custom_commands={}){
	if( typeof initial === 'string' ) initial = JSON.parse(initial)
	if( typeof custom_commands === 'string' ) custom_commands = JSON.parse(custom_commands)
	if( typeof id === 'string' ) return Konekti.plugin.canvas.connect({"id":id,"custom":custom_commands,"commands":initial})
	else return Konekti.plugin.canvas.connect(id)
}

