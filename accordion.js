Konekti.uses('header')

/** Konekti Plugin for Accordion components */
class AccordionPlugIn extends PlugIn{
	/** Creates a Plugin for Dropdown components */
	constructor(){ super('accordion') }
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( config ){ return new Accordion(config) }
}

/** An Accordion component */
class Accordion extends Client{
	/**
	 * Creates a dropdown component
	 * @param config Dropdown configuration
	 */
	constructor( config ){ 
		super(config)
		var x = this
		this.header = config.children[0].id
		this.content = config.children.length>1?config.children[1].id:null
		this.expand = config.expand
		this.children[this.header].vc().onclick = function(){ x.show() }
		this.children[this.header].vc().style.cursor = 'pointer'
		if( this.content !== null ) Konekti.vc(this.content).className += "w3-container w3-hide w3-show"
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.children[this.header].setParentSize(parentWidth,parentHeight)
		if(this.content!=null) this.children[this.content].setParentSize(parentWidth,parentHeight)
		this.height = this.children[this.header].height + ((this.content!=null)?this.children[this.content].height:0)
		this.vc().style.height = this.height
	} 

	
	/**
	 * Shows/hides the drop option list
	 */
	show(){
		var x = Konekti.vc(this.content)
		if (x!==undefined && x!==null){ 
			if( x.className.indexOf("w3-show") == -1){
				x.className += " w3-show"
				
				if(this.expand !== undefined) this.expand(this.id) 
  			}else x.className = x.className.replace(" w3-show", "");
  		}else{ 
  			if(this.expand !== undefined) this.expand(this.id)
  		}			
	}	
}

/** Accordion class */
if(Konekti.accordion === undefined) new AccordionPlugIn()

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
 * @param parent Parent component
 */
Konekti.accordionConfig = function(id, icon, caption, h, style, content, parent){
	var children = [Konekti.headerConfig(id+'Item', icon, caption, h, style, id)]
	if(content!=null){
		content.parent = content.parent || id
		content.id = content.id || id+'Content'
		children.push(content)
	}
	return {'plugin':'accordion', 'id':id, 'parent':parent, 'children':children}
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
 * @param parent Parent component
 */
Konekti.accordion = function(id, icon, caption, h, style, content, parent){
	return Konekti.build(Konekti.accordionConfig(id, icon, caption, h, style, content, parent))
}

/**
 * Creates a TOC configuration object
 * @method
 * tocConfig
 * @param tree Table of Content component 
 * @param h Size of the main content (1,2,3..)
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param parent Parent component
 */
Konekti.tocConfig = function(tree, h, style, onclick, parent){
	var content =null
	if(tree.children !== undefined){
		content = Konekti.divConfig(tree.id+'Content', '', '', '', '', tree.id)		
		content.children = []
		for( var i=0; i<tree.children.length; i++ ){
			content.children.push(Konekti.tocConfig(tree.children[i], h+1, style, onclick, tree.id+'Content'))
		}
	}
	var item = Konekti.accordionConfig(tree.id, tree.icon, tree.caption, h, style, content, parent)
	item.expand = onclick
	return item
}

/**
 * Associates/adds a table of contents
 * @method
 * btn
 * @param tree Table of Content component 
 * @param h Size of the main content (1,2,3..)
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param parent Parent component
 */
Konekti.toc = function(tree, h, style, onclick, parent){
	return Konekti.build(Konekti.tocConfig(tree, h, style, onclick, parent))
}
