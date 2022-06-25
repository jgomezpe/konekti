/** Konekti Split Client */
class SplitClient extends Client{
	/** 
	 * Creates a Split client
	 * @param config Split configuration
	 */
	constructor( config ){
		super(config)
		this.start = config.start || 50
		this.type = config.type || 'col'
		var xfloat = this.type=='col'?'float:left;':''
		var xheight = this.type=='col'?'100%':'5px'
		var xwidth = this.type=='col'?'5px':'100%'
		this.one = Konekti.div( this.id + 'One', xwidth, xheight, "style='"+xfloat+"'", '', this.id)
		this.bar = Konekti.div( this.id + 'Bar', xwidth, xheight, "style='cursor:'"+this.type+'-resize;'+xfloat+"' class='w3-sand'", '', this.id)
		this.two = Konekti.div( this.id + 'Two', xwidth, xheight, "style='"+xfloat+"'", '', this.id)
		
		if( config.one !== undefined ){
			config.one.parent = this.id + 'One'
			config.one.width = '100%'
			config.one.height = '100%'
			Konekti.build(config.one)
		}
		if( config.two !== undefined ){
			config.two.width = '100%'
			config.two.height = '100%'
			config.two.parent = this.id + 'Two'
			Konekti.build(config.two)
		}
		
		var x = this
		var c = this.bar.vc()
		c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
		c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
		window.addEventListener("mousemove", function(e){ x.dragmove(e); } )
		window.addEventListener("touchmove", function(e){ x.dragmove(e); } )
		window.addEventListener("mouseup", function(){ x.dragend(); } )
		window.addEventListener("touchend", function(){ x.dragend(); } )
	}

	/**
	 * Inits the drag of the split bar
	 * @param e Event information
	 */
	dragstart(e) {
		e.preventDefault()
		this.dragging = true
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
			var x = e.pageX-r.left-window.scrollX
			var y = e.pageY-r.top-window.scrollY
			if(this.type=='col'){
				if(x>5 && x<this.width-5){
					this.one.defWidth = x + 'px'
					this.two.defWidth = (this.width-5-x) + 'px'
					this.one.setParentSize(this.width, this.height)
					this.two.setParentSize(this.width, this.height)
				}
			}else{
				if(y>5 && y<this.height-5){
					this.one.defHeight = y + 'px'
					this.two.defHeight = (this.height-5-y) + 'px'
					this.one.setParentSize(this.width, this.height)
					this.two.setParentSize(this.width, this.height)
				}
			}
    }
	}
	
	/**
	 * Stops the drag of the split bar
	 */
	dragend() { this.dragging = false }    
	
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize(parentWidth, parentHeight)
		parentWidth = this.width
		parentHeight = this.height
		var s = this.start
		if(s!=0){
			if(this.type=='col'){
				this.one.defWidth = Math.round(s*(parentWidth-5)/100)	+ 'px'
				this.two.defWidth = Math.round((100-s)*(parentWidth-5)/100)	+ 'px'  
				this.one.defHeight = '100%'	
				this.two.defHeight = '100%'	  
			}else{
				this.one.defHeight = Math.round(s*(parentHeight-5)/100)	+ 'px'
				this.two.defHeight = Math.round((100-s)*(parentHeight-5)/100)	+ 'px'  
				this.one.defWidth = '100%'	
				this.two.defWidth = '100%'	  
			}
			this.start = 0
		}else{
			if(this.type=='col'){
				this.two.defWidth = (parentWidth - this.one.width - 5) + 'px'
			}else{
				this.two.defHeight = (parentHeight - this.one.height - 5) + 'px'
			}		
		}
		for( var c in this.children ) this.children[c].setParentSize(this.width,this.height)
	} 
}

/** Konekti Split PlugIn */
class SplitPlugIn extends PlugIn{
	/** Creates a Plugin for split components */
	constructor(){ super('split') }
	
	/**
	 * Gets a client for a Split component
	 * @param config Split configuration
	 */  
	client( config ){ return new SplitClient(config) }    
}

/** SplitPanel class */
if(Konekti.split===undefined) new SplitPlugIn()

/**
 * Creates a Split configuration object
 * @method
 * splitConfig
 * @param id Id of the split component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param type Type of split 'col' Vertical or 'row' Horizontal
 * @param percentage Percentage of the left/top subcomponent relative to the component's size
 * @param one Left/Top component
 * @param two Right/Bottom component
 * @param parent Parent component
 */
Konekti.splitConfig = function(id, width, height, type, percentage, one, two, parent){
	return {'plugin':'split','id':id, 'width':width, 'height':height, 'type':type, 'start':percentage, 'one':one, 'two':two, 'parent':parent}
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
 */
Konekti.split = function(id, width, height, type, percentage, one, two, parent){
	return Konekti.build(Konekti.splitConfig(id, width, height, type, percentage, one, two, parent))
}
