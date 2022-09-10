/** An Accordion component */
class Accordion extends Container{
	/**
	 * Creates an accordion configuration object
	 * @method
	 * accordionConfig
	 * @param id Id of the header
	 * @param width Width of the sidebar
	 * @param height Height of the div's component
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param style Style of the header
	 * @param content Content component
	 * @param open If content component should be displayed or not
	 * @param parent Parent component
	 */
	setup(id, icon, caption, h, style, content, open, parent='KonektiMain'){
		var children = [{'plugin':'header', 'setup':[id+'Item', icon, caption, h, style, id]}]
		if(content!=null){
			content.parent = content.parent || id
			content.id = content.id || id+'Content'
			children.push(content)
		}
		return {'plugin':'accordion', 'id':id, 'parent':parent, 'open':open, 'children':children}
	}	

	/**
	 * Creates an accordion configuration object
	 * @method
	 * accordionConfig
	 * @param id Id of the header
	 * @param width Width of the sidebar
	 * @param height Height of the div's component
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param style Style of the header
	 * @param content Content component
	 * @param open If content component should be displayed or not
	 * @param parent Parent component
	 */
	constructor(id, icon, caption, h, style, content, open, parent='KonektiMain'){ 
		super(...arguments)
		this.expand = this.config.expand
	}

	setChildrenBack(){
		super.setChildrenBack()
		var x = this
		this.children[0].vc().onclick = function(){ x.show() }
		this.children[0].vc().style.cursor = 'pointer'
		if( this.children.length == 2 ) this.children[1].vc().className += "w3-container w3-hide" + (this.config.open?" w3-show":"")
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		var x = this
		function check(){
			if(x.children !== undefined){
				for( var i=0; i<x.children.length; i++ ) x.children[i].setParentSize(parentWidth,parentHeight)
				var h = 0
				for( var i=0; i<x.children.length; i++ ) h += x.children[i].height
				x.height = h
				x.vc().style.height = x.height
			}else setTimeout(check, 100)
		}
		check()		
	} 

	
	/**
	 * Shows/hides the drop option list
	 */
	show(){
		if(this.children.length>1){
			var x = Konekti.vc(this.children[1].id)
			if( x.className.indexOf("w3-show") == -1){
				x.className += " w3-show"				
				if(this.expand !== undefined){
					if(typeof this.expand == 'function') this.expand(this.id)
					else Konekti.client[this.expand.client][this.expand.method](this.id)
				}  
  			}else x.className = x.className.replace(" w3-show", "");
  		}else{ 
			if(this.expand !== undefined){
				if(typeof this.expand == 'function') this.expand(this.id)
				else Konekti.client[this.expand.client][this.expand.method](this.id)
			}  
	  	}			
	}	
}

/**
 * Associates/adds an accordion
 * @method
 * accordion
 * @param id Id of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param h Size of the header (1,2,3..)
 * @param style Style of the header
 * @param content Content component
 * @param open If content component should be displayed or not
 */
Konekti.accordion = function(id, icon, caption, h, style, content, open){
	return new Accordion(id, icon, caption, h, style, content, open)
}