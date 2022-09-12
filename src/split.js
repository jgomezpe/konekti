
/** Konekti Split Client */
class Split extends Container{
	/**
	 * Creates a Split configuration object
	 * @param id Id of the split component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param type Type of split 'col' Vertical or 'row' Horizontal
	 * @param percentage Percentage of the left/top subcomponent relative to the component's size
	 * @param one Left/Top component
	 * @param two Right/Bottom component
	 * @param parent Parent component
	 */
	setup(id, width, height, type, percentage, one, two, parent='KonektiMain'){
		percentage = percentage || 50
		type = type || 'col'
		var xfloat = type=='col'?'float:left;':''
		var xheight = type=='col'?'100%':'8px'
		var xwidth = type=='col'?'8px':'100%'

		one.parent = id + 'One'
		one.width = '100%'
		one.height = '100%'
		var done = {'plugin':'container', 'setup':[id+'One', xwidth, xheight, "style='"+xfloat+"'", [one], id]}

		var bar = {'plugin':'div', 'setup':[id+'Bar', xwidth, xheight, "style='cursor:"+type+'-resize;'+xfloat+"' class='w3-sand'", '', id]}

		two.width = '100%'
		two.height = '100%'
		two.parent = id + 'Two'
		var dtwo = {'plugin':'container', 'setup':[id+'Two', xwidth, xheight, "style='"+xfloat+"'", [two], id]}
		
		var children = [done, bar, dtwo] 
		return {'plugin':'split','id':id, 'width':width, 'height':height, 'type':type, 'start':percentage, 'children':children, 'parent':parent}
	}

	/** 
	 * Creates a Split client
	 * @param id Id of the split component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param type Type of split 'col' Vertical or 'row' Horizontal
	 * @param percentage Percentage of the left/top subcomponent relative to the component's size
	 * @param one Left/Top component
	 * @param two Right/Bottom component
	 * @param parent Parent component
	 */
	constructor(id, width, height, type, percentage, one, two, parent='KonektiMain'){
		super(...arguments)
		this.type = this.config.type
		this.start = this.config.start
	}

	setChildrenBack(){
		var x = this
		var c = x.children[1].vc()
		c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
		c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
		x.vc('Over').addEventListener("mouseleave", function(e){ x.dragend(e);} )
		window.addEventListener("mousemove", function(e){ x.dragmove(e); } )
		window.addEventListener("touchmove", function(e){ x.dragmove(e); } )
		window.addEventListener("mouseup", function(){ x.dragend(); } )
		window.addEventListener("touchend", function(){ x.dragend(); } )
	}

	html(){
		return "<div id='"+this.id+"' "+this.config.config+"><div id='"+this.id +
		"Over' style='left:0px; top:0px; height:100%;width:100%;background-color:transparent;position:fixed!important;z-index:40;overflow:auto;display:none'></div></div>" 
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
			var x = e.pageX-r.left-window.scrollX
			var y = e.pageY-r.top-window.scrollY
			if(this.type=='col'){
				if(x>4 && x<this.width-4){
					this.children[0].defWidth = (x-4) + 'px'
					this.children[2].defWidth = (this.width-4-x) + 'px'
					this.children[0].setParentSize(this.width, this.height)
					this.children[2].setParentSize(this.width, this.height)
				}
			}else{
				if(y>4 && y<this.height-4){
					this.children[0].defHeight = (y-4) + 'px'
					this.children[2].defHeight = (this.height-4-y) + 'px'
					this.children[0].setParentSize(this.width, this.height)
					this.children[2].setParentSize(this.width, this.height)
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
				this.children[0].defWidth = Math.round(s*(parentWidth-8)/100)	+ 'px'
				this.children[2].defWidth = Math.round((100-s)*(parentWidth-8)/100)	+ 'px'  
				this.children[0].defHeight = '100%'	
				this.children[2].defHeight = '100%'	  
			}else{
				this.children[0].defHeight = Math.round(s*(parentHeight-8)/100)	+ 'px'
				this.children[2].defHeight = Math.round((100-s)*(parentHeight-8)/100)	+ 'px'  
				this.children[0].defWidth = '100%'	
				this.children[2].defWidth = '100%'	  
			}
			this.start = 0
		}else{
			if(this.type=='col'){
				this.children[2].defWidth = (parentWidth - this.children[0].width - 8) + 'px'
			}else{
				this.children[2].defHeight = (parentHeight - this.children[0].height - 8) + 'px'
			}		
		}
		for( var i=0; i<this.children.length; i++ ) this.children[i].setParentSize(this.width,this.height)
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
 */
Konekti.split = function(id, width, height, type, percentage, one, two, parent='KonektiMain'){
	return new Split(id, width, height, type, percentage, one, two, parent)
}
