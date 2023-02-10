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
		x.ctype = 'none'
		var c = x.vc('Bar')
		c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
		c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
		c = x.vc('Over')
		c.addEventListener("mouseleave", function(e){ x.dragend(e);} )
		c.addEventListener("mousemove", function(e){ x.dragmove(e); } )
		c.addEventListener("touchmove", function(e){ x.dragmove(e); } )
		c.addEventListener("mouseup", function(){ x.dragend(); } )
		c.addEventListener("touchend", function(){ x.dragend(); } )
		var ro = new ResizeObserver(entry => { x.resize() });
		// Resize observer
		ro.observe(this.vc())

		window.dispatchEvent(new Event('resize'))
	}

	/**
	 * Inits the drag of the split bar
	 * @param e Event information
	 */
	dragstart(e) {
		e.preventDefault()
		this.dragging = true
		var c = this.vc()
		var r = c.getBoundingClientRect()
		var over = this.vc('Over')
		over.style.width = window.innerWidth + 'px'
		over.style.height = window.innerHeight + 'px'		
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
				if(x>8 && x<r.width-8){
					this.vc('One').style.width = (x-4) + 'px'
					this.vc('Two').style.width = (r.width-8-x) + 'px'
					for(var i=1; i<4; i++)	this.children[i].vc().style.height = r.height + 'px'	
					this.vc('Bar').style.cursor = 'col-resize'
				}
			}else{
				if(y>8 && y<r.height-8){
					this.vc('One').style.height = (y-4) + 'px'
					this.vc('Two').style.height = (r.height-8-y) + 'px'
					for(var i=1; i<4; i++)	this.children[i].vc().style.width = r.width + 'px'
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
	resize(){
		var x = this
		x.vc('Over').style.width = window.innerWidth + 'px'
		x.vc('Over').style.height = window.innerHeight + 'px'
		var c = this.vc()
		var r = c.getBoundingClientRect()
		var width = r.width
		var height = r.height
		var type = (width<Konekti.MEDIUMSIZE)? 'row': x.type
		if(type=='col'){
			var left = x.vc('One').clientWidth || 0
			if(type!=x.ctype || left == 0) left = Math.round(x.start*(width-8)/100)
			x.vc('One').style.width = left + 'px'
			x.vc('Bar').style.width = '8px'
			x.vc('Bar').style.cursor = 'col-resize'
			x.vc('Two').style.width = (width-8-left) + 'px'
			for(var i=1; i<4; i++)	x.children[i].vc().style.height = '100%'
		}else{
			var top = x.vc('One').clientHeight || 0
			if(type!=x.ctype || top == 0) top = Math.round(x.start*(height-8)/100)
			x.vc('One').style.height = top + 'px'
			x.vc('Bar').style.height = '8px'
			x.vc('Bar').style.cursor = 'row-resize'
			x.vc('Two').style.height = (height-8-top) + 'px'
			for(var i=1; i<4; i++)	x.children[i].vc().style.width = '100%'
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
