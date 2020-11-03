class CanvasEditor extends KonektiEditor{
	constructor(dictionary){
		super(dictionary)
		var id = this.id
		this.gui = this.vc('Canvas')
		this.custom = {}
		if( typeof dictionary.custom != 'undefined' ) this.custom_commands( dictionary.custom )
		if( typeof dictionary.commands !== 'undefined' ) this.commands = dictionary.commands
		else this.commands = {}
		this.redraw()
	}
	
	custom_commands( custom ){
	    if( typeof custom !== 'undefined' ){
	        for( var i=0; i<custom.commands.length; i++ ){
	            this.custom[custom.commands[i].command] = custom.commands[i]
	        }
	    }
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
	
	rotate_point( cx, cy, px, py, angle ){
		var alpha = this.angle( cx, cy, px, py ) + angle
		if( alpha>1e-6 ){
			var a = (px-cx)
            var b = (py-cy)
			var r = Math.sqrt(a*a+b*b)
			return [cx + r*Math.cos(alpha), cy + r*Math.sin(alpha)]
		}else return [px,py]			
	}
	
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

	resize(){
		var used = this.commands
		var ctx = this.getContext()
		ctx.canvas.width = this.gui.offsetWidth
		ctx.canvas.height = this.gui.offsetHeight
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

		var x = obj.x 
		var y = obj.y 
		var width = obj.width 
		var height = obj.height

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
		for( var i=0; i<objs.length; i++ ) this[objs[i].command](objs[i])
	}

	beginPath(obj){ this.getContext().beginPath() }

	closePath(obj){ this.getContext().closePath() }

	moveTo(obj){
		var ctx = this.getContext()
		var x = obj.x 
		var y = obj.y
		ctx.moveTo(x,y)
	}

	lineTo(obj){
		var ctx = this.getContext()
		var x = obj.x
		var y = obj.y
		ctx.lineTo(x,y)
	}

	quadTo(obj){
		var ctx = this.getContext()
		var cp1x = obj.x[0] 
		var cp1y = obj.y[0]
		var x = obj.x[1]
		var y = obj.y[1]
		ctx.quadraticCurveTo(cp1x, cp1y, x, y) 
	}

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
	
    rgba( obj ){ return "rgba("+obj.red+","+obj.green+","+obj.blue+","+obj.alpha+")"; }

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
	
	copy(c){
	    var cc = {}
	    for( var x in c ){
	        cc[x] = c[x]
	    }
	    return cc 
	}

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

	draw(obj){
		obj = this.init_command(obj)
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
class KonektiCanvasPlugIn extends KonektiPlugIn{
    constructor(){ 
        super('canvas') 
        this.client = {}
    }

    resize() {
        var canvas = Konekti.plugin.canvas
        for (var cc in canvas.client){
            canvas.client[cc].redraw()
        }
    }

    extra( dictionary ){ this.client[dictionary.id] = new CanvasEditor( dictionary) } 
}

new KonektiCanvasPlugIn()

window.addEventListener("resize", Konekti.plugin.canvas.resize)
