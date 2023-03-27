/** Konekti Split Plugin */
class SplitPlugin extends PlugIn{
	constructor(){ super('split') }

	/**
	 * Creates a Split configuration object
	 * @param parent Parent component
	 * @param id Id of the split component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param type Type of split 'col' Vertical or 'row' Horizontal
	 * @param percentage Percentage of the left/top subcomponent relative to the component's size
	 * @param one Left/Top component
	 * @param two Right/Bottom component
	 * @param config Style of the split
	 */
	setup(parent, id, type, percentage, one, two, config={}){
		percentage = percentage || 50
		type = type || 'col'
		config.layout = 'res'

		var done = {'plugin':'raw', 'setup':[id+'One', one, {'style':'float:left;'}]}

		var over = {'plugin':'raw', 'setup':[id+'Over', '',
			 		{"style":'left:0px; top:0px;background-color:transparent;position:fixed!important;z-index:40;overflow:auto;display:none'}]}
		var bar = {'plugin':'raw', 'setup':[id+'Bar', '', {"style":"cursor:"+type+"-resize;float:left;", "class":"w3-sand"}]}

		var dtwo = {'plugin':'raw', 'setup':[id+'Two', two, {'style':'float:left;'}]}
	
		var c = super.setup(parent, id,  [over, done, bar, dtwo], config)

		c.type=type
		c.start=percentage
		return c
	}

	/** 
	 * Creates a Split client
	 */
	client(config){ return new Split(config) }
}


/** Adds the split plugin to Konekti */
new SplitPlugin()


/** Konekti Split Client */
class Split extends Client{
	/** 
	 * Creates a Split client
	 */
	constructor(config){ 
		super(config) 
		var x = this
		Konekti.daemon(function(){ return x.vc()!==undefined && x.vc()!==null }, 
			function(){
				var c = x.vc('Bar')
				c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
				c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
				c = x.vc('Over')
				c.addEventListener("mouseleave", function(e){ x.dragend(e);} )
				c.addEventListener("mousemove", function(e){ x.dragmove(e); } )
				c.addEventListener("touchmove", function(e){ x.dragmove(e); } )
				c.addEventListener("mouseup", function(){ x.dragend(); } )
				c.addEventListener("touchend", function(){ x.dragend(); } )
			}
		)
	}

	/**
	 * Inits the drag of the split bar
	 * @param e Event information
	 */
	dragstart(e) {
		e.preventDefault()
		this.dragging = true
		this.children[0].resize( window.innerWidth, window.innerHeight )
		this.vc('Over').style.display = 'block'
	}
    
	/**
	 * Checks the drag of the split bar
	 * @param e Event information
	 */
	dragmove(e) {
		if (this.dragging){
			var c = this.vc()
			var r = c.getBoundingClientRect()
			var type = (r.width<Konekti.MEDIUMSIZE)? 'row': this.type
			this.ctype = type
			var x = e.pageX-r.left-window.scrollX
			var y = e.pageY-r.top-window.scrollY
			if(type=='col'){
				if(x>8 && x<r.width-8){
					this.children[1].resize(x-4, r.height)
					this.children[2].resize(8, r.height)
					this.children[3].resize(r.width-8-x, r.height)		
					this.vc('Bar').style.cursor = 'col-resize'
				}
			}else{
				if(y>8 && y<r.height-8){
					this.children[1].resize(r.width, y)
					this.children[2].resize(r.width, 8)
					this.children[3].resize(r.width, r.height-8-y)
					this.vc('Bar').style.cursor = 'row-resize'
				}
			}
    	}
	}
	
	/**
	 * Stops the drag of the split bar
	 */
	dragend() {
		this.dragging = false 
		this.vc('Over').style.display = 'none'
	}  
		
	/**
	 * Sets the parent's size (adjust each of its children components)
	 */
	resize(width, height){
		var x = this	
        x.vc().style.width = width + 'px'
        x.vc().style.height = height + 'px'
		var x = this
		x.children[0].resize( window.innerWidth, window.innerHeight )

		var type = (width<Konekti.MEDIUMSIZE)? 'row': x.type
		if(type=='col'){
			var left = Math.round(x.start*(width-8)/100)
			x.children[1].resize(left, height)
			x.children[2].resize(8, height)
			x.children[3].resize(width-8-left, height)
			this.vc('Bar').style.cursor = 'col-resize'
		}else{
			var top = Math.round(x.start*(height-8)/100)
			x.children[1].resize(width, top)
			x.children[2].resize(width, 8)
			x.children[3].resize(width, height-8-top)
			this.vc('Bar').style.cursor = 'row-resize'
		}
	} 
}

/**
 * Associates/adds Split panel
 * @method
 * split
 * @param id Id of the split component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param type Type of split 'col' Vertical or 'row' Horizontal
 * @param percentage Percentage of the left/top subcomponent relative to the component's size
 * @param one Left/Top component
 * @param two Right/Bottom component
 * @param config split configuration
 * @param callback Function called when the split component is ready
 */
Konekti.split = function(id, type, percentage, one, two, config={}, callback=function(){}){
	Konekti.add({'plugin':'split','setup':['body',id,type,percentage,one,two,config]}, callback)
}
