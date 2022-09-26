
/** Konekti Split Client */
class Split extends Container{
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
	setup(parent, id, width, height, type, percentage, one, two, config={}){
		percentage = percentage || 50
		type = type || 'col'

		var xfloat = type=='col'?'float:left;':''
		var xheight = type=='col'?'100%':'8px'
		var xwidth = type=='col'?'8px':'100%'

		var done = {'plugin':'container', 'setup':['container', id+'One', [one], xwidth, xheight, {"style":xfloat}]}

		var over = {'plugin':'html', 'setup':[id+'Over', '100%', '100%', 
					{"style":'left:0px; top:0px; height:100%;width:100%;background-color:transparent;position:fixed!important;z-index:40;overflow:auto;display:none'}]}
		var bar = {'plugin':'html', 'setup':[id+'Bar', xwidth, xheight, {"style":"cursor:"+type+"-resize;"+xfloat, "class":"w3-sand"}]}

		var dtwo = {'plugin':'container', 'setup':['container', id+'Two', [two], xwidth, xheight, {"style":xfloat}]}
		
		var c = super.setup(parent, 'split', id,  [over, done, bar, dtwo], width, height, config)
		c.type=type
		c.start=percentage
		return c
	}

	/** 
	 * Creates a Split client
	 */
	constructor(){ super(...arguments) }

	setChildrenBack(){
		super.setChildrenBack()
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
		Konekti.resize()
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
			if(this.ctype=='col'){
				if(x>4 && x<this.width-4){
					this.children[1].defwidth = (x-4) + 'px'
					this.children[3].defwidth = (this.width-4-x) + 'px'
					this.children[1].setParentSize(this.width, this.height)
					this.children[3].setParentSize(this.width, this.height)
					this.vc('Bar').style.cursor = 'col-resize'
				}
			}else{
				if(y>4 && y<this.height-4){
					this.children[1].defheight = (y-4) + 'px'
					this.children[3].defheight = (this.height-4-y) + 'px'
					this.children[1].setParentSize(this.width, this.height)
					this.children[3].setParentSize(this.width, this.height)
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
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setChildrenSize( parentWidth, parentHeight ){
		var x = this
		function check(){
			if( x.children !== undefined && x.children !== null && x.children.length>0 ){
				parentWidth = x.width
				parentHeight = x.height
				var type = (parentWidth<992)? 'row': x.type
				if(type!=x.ctype){
					var s = x.start
					if(type=='col'){
						x.children[1].defwidth = Math.round(s*(parentWidth-8)/100)	+ 'px'
						x.children[2].defwidth = '8px'
						x.children[3].defwidth = Math.round((100-s)*(parentWidth-8)/100)	+ 'px'  
						x.children[1].defheight = '100%'	
						x.children[2].defheight = '100%'	
						x.children[3].defheight = '100%'	  
						x.vc('Bar').style.cursor = 'col-resize'
					}else{
						x.children[1].defheight = Math.round(s*(parentHeight-8)/100)	+ 'px'
						x.children[2].defheight = '8px'
						x.children[3].defheight = Math.round((100-s)*(parentHeight-8)/100)	+ 'px'  
						x.children[1].defwidth = '100%'	
						x.children[2].defwidth = '100%'
						x.children[3].defwidth = '100%'	  
						x.vc('Bar').style.cursor = 'row-resize'
					}
					x.ctype = type
				}else{
					if(type=='col'){
						x.children[3].defwidth = (parentWidth - x.children[1].width - 8) + 'px'
					}else{
						x.children[3].defheight = (parentHeight - x.children[1].height - 8) + 'px'
					}		
				}
				for( var i=0; i<x.children.length; i++ ) x.children[i].setParentSize(x.width,x.height)				
			}else setTimeout(check, 100)
		}
		check()		
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
 */
Konekti.split = function(parent, id, width, height, type, percentage, one, two, config){
	return new Split(parent, id, width, height, type, percentage, one, two, config)
}
