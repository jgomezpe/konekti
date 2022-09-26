/** An Accordion component */
class Accordion extends Container{
	/**
	 * Creates an accordion configuration object
	 * @method
	 * accordionConfig
	 * @param parent Parent component
	 * @param id Id of the header
	 * @param width Width of the sidebar
	 * @param height Height of the div's component
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param style Style of the header
	 * @param content Content component
	 * @param open If content component should be displayed or not
	 * @param onclick Method call when the accordion item is selected
	 */
	setup(parent, id, icon, caption, style, content, open, onclick=''){
		var children = [{'plugin':'item', 'setup':[id+'Item', icon, caption, style]}, content]
		var c = super.setup(parent, 'accordion', id, children)
		c.onclick = Konekti.dom.onclick(id, onclick)
		c.open = open
		return c
	}	

	/**
	 * Creates an accordion configuration object
	 */
	constructor(){ super(...arguments) }

	setChildrenBack(){
		super.setChildrenBack()
		var x = this
		this.children[0].vc().onclick = function(){ x.show() }
		this.children[0].vc().style.cursor = 'pointer'
		if( this.children.length == 2 ) this.children[1].vc().className += "w3-hide" + (this.open?" w3-show":"")
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		super.setParentSize(parentWidth, parentHeight)
		var x = this
		function check(){
			if( x.children[0] instanceof Client ){
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
			if( x.className.indexOf("w3-show") == -1) x.className += " w3-show"				
			else x.className = x.className.replace(" w3-show", "");
  		}
		eval(this.onclick) 		
	}	
}

/**
 * Associates/adds an accordion
 * @method
 * accordion
 * @param parent Parent component
 * @param id Id of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param style Style of the header
 * @param content Content component
 * @param open If content component should be displayed or not
 * @param onclick Method call when the accordion item is selected
 */
Konekti.accordion = function(parent, id, icon, caption, style, content, open, onclick=''){
	return new Accordion(parent, id, icon, caption, style, content, open, onclick)
}

