Konekti.uses('accordion')

/** Konekti Plugin for Table of Contents components */
class TOCPlugIn extends PlugIn{
	/** Creates a Plugin for Table of Contents components */
	constructor(){ super('toc') }
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( config ){ return new TOC(config) }
}

/** A Table of Content component */
class TOC extends Client{
	/**
	 * Creates a TOC component
	 * @param config TOC configuration
	 */
	constructor( config ){ 
		super(config)
		var x = this
		this.header = config.children[0].id
		this.content = config.children[1].id
		this.expand = config.expand
		Konekti.vc(this.header).onclick = function(){ x.show() }
		Konekti.vc(this.header).style.cursor = 'pointer'
		Konekti.vc(this.content).className += "w3-container w3-hide w3-show"
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.children[this.header].setParentSize(parentWidth,parentHeight)
		this.children[this.content].setParentSize(parentWidth,parentHeight)
		this.height = this.children[this.header].height + this.children[this.content].height
		this.vc().style.height = this.height
	} 

	
	/**
	 * Shows/hides the drop option list
	 */
	show(){
		var x = Konekti.vc(this.content)
		if (x.className.indexOf("w3-show") == -1){
			x.className += " w3-show"
			if(this.expand !== undefined) expand(this.id) 
  		}else x.className = x.className.replace(" w3-show", "");		
	}	
}

/** Accordion class */
if(Konekti.accordion === undefined) new AccordionPlugIn()

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
	if(tree.children != undefined){
		content = Konekti.div(tree.id+'Content', '', '', '', '', this.id)
		content.children = []
		for( var i=0; i<tree.children.length; i++ ){
			content.children.push(Konekti.tocConfig(tree.children[i], h+1, style, onclick, tree.id))
		}
	}
	return Konekti.accordionConfig(tree.id, tree.icon, tree.caption, h, style, content, parent)
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
	return Konekti.build(Konekti.tocConfig(id, icon, caption, h, style, content, parent))
}
