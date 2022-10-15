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


		var done = {'plugin':'raw', 'setup':[id+'One', one, {'style':'float:left;'}]}

		var over = {'plugin':'raw', 'setup':[id+'Over', '',
					{"style":'left:0px; top:0px; height:100%;width:100%;background-color:transparent;position:fixed!important;z-index:40;overflow:auto;display:none'}]}
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
		x.ctype = 'none'
		var c = x.children[2].vc()
		c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
		c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
		x.vc('Over').addEventListener("mouseleave", function(e){ x.dragend(e);} )
		window.addEventListener("mousemove", function(e){ x.dragmove(e); } )
		window.addEventListener("touchmove", function(e){ x.dragmove(e); } )
		window.addEventListener("mouseup", function(){ x.dragend(); } )
		window.addEventListener("touchend", function(){ x.dragend(); } )
		var ro = new ResizeObserver(entry => {
			entry = entry[0]
			var w = x.vc().clientWidth
			var h = x.vc().clientHeight
			x.resize( w, h )
		});
		// Resize observer
		ro.observe(this.vc())
		x.resize(this.vc().clientWidth, this.vc().clientHeight)
	}

	/**
	 * Inits the drag of the split bar
	 * @param e Event information
	 */
	dragstart(e) {
		e.preventDefault()
		this.dragging = true
		var over = this.vc('Over')
		over.style.width = window.innerWidth
		over.style.height = window.innerHeight
		over.style.display = 'block'
	}
    
	/**
	 * Checks the drag of the split bar
	 * @param e Event information
	 */
	dragmove(e) {
		var id = this.id
		if (this.dragging){
			var c = this.vc()
			var r = c.getBoundingClientRect()
			var type = (r.width<Konekti.MEDIUMSIZE)? 'row': this.type
			this.ctype = type
			var x = e.pageX-r.left-window.scrollX
			var y = e.pageY-r.top-window.scrollY
			if(type=='col'){
				if(x>4 && x<r.width-4){
					this.children[1].vc().style.width = (x-4) + 'px'
					this.children[3].vc().style.width = (r.width-4-x) + 'px'
					for(var i=0; i<4; i++)	this.children[i].vc().style.height = r.height + 'px'	
					this.vc('Bar').style.cursor = 'col-resize'
				}
			}else{
				if(y>4 && y<r.height-4){
					this.children[1].vc().style.height = (y-4) + 'px'
					this.children[3].vc().style.height = (r.height-4-y) + 'px'
					for(var i=0; i<4; i++)	this.children[i].vc().style.width = r.width + 'px'
					this.vc('Bar').style.cursor = 'row-resize'
				}
			}
    	}
	}
	
	/**
	 * Stops the drag of the split bar
	 */
	dragend() { 
		if(this.dragging){
			this.dragging = false 
			this.vc('Over').style.display = 'none'
		}
	}  
		
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param width Parent's width
	 * @param height Parent's height
	 */
	resize( width, height ){
		var x = this
		var c = this.vc()
		var r = c.getBoundingClientRect()
		var type = (width<Konekti.MEDIUMSIZE)? 'row': x.type
		if(type=='col'){
			var left = x.children[1].vc().clientWidth
			if(type!=x.ctype || left==0){ 
				left = Math.round(x.start*(width-8)/100)
				x.children[1].vc().style.width = left + 'px'
			}	
			x.children[2].vc().style.width = '8px'
			x.children[3].vc().style.width = (width-8-left) + 'px'
			for(var i=0; i<4; i++)	x.children[i].vc().style.height = height + 'px'
			x.vc('Bar').style.cursor = 'col-resize'
		}else{
			var top = x.children[1].vc().clientHeight
			if(type!=x.ctype || top==0){ 
				top = Math.round(x.start*(height-8)/100)
				x.children[1].vc().style.height = top + 'px'
			}	
			x.children[2].vc().style.height = '8px'
			x.children[3].vc().style.height = (height-8-top) + 'px'
			x.vc('Bar').style.cursor = 'row-resize'
			for(var i=0; i<4; i++)	x.children[i].vc().style.width = width + 'px'
		}
		x.ctype = type
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
 * @param parent Parent component
 * @param config split configuration
 * @param callback Function called when the split component is ready
 */
Konekti.split = function(parent, id, type, percentage, one, two, config, callback){
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==6) args[6] = {}
	if(args.length==7) args[7] = function(){}
	Konekti.add('split', ...args)
}
