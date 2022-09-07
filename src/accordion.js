uses('header')

/** Konekti Plugin for Accordion components */
class AccordionPlugIn extends PlugIn{
	/** Creates a Plugin for Accordion components */
	constructor(){ super('accordion') }

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
		var config = id
		if(typeof id == 'string'){
			var children = [Konekti.plugin['header'].setup(id+'Item', icon, caption, h, style, id)]
			if(content!=null){
				content.parent = content.parent || id
				content.id = content.id || id+'Content'
				children.push(content)
			}
			config ={'id':id, 'parent':parent, 'open':open, 'children':children}
		}
		config.plugin = 'accordion'
		return config
	}	
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( config ){ return new Accordion(config) }
}

/** An Accordion component */
class Accordion extends Client{
	/**
	 * Creates an accordion component
	 * @param config Accordion configuration
	 */
	constructor( config ){ 
		super(config)
		var x = this
		this.expand = config.expand
		this.children[0].vc().onclick = function(){ x.show() }
		this.children[0].vc().style.cursor = 'pointer'
		if( this.children.length == 2 ) this.children[1].vc().className += "w3-container w3-hide" + (config.open?" w3-show":"")
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		for( var i=0; i<this.children.length; i++ ) this.children[i].setParentSize(parentWidth,parentHeight)
		var h = 0
		for( var i=0; i<this.children.length; i++ ) h += this.children[i].height
		this.height = h
		this.vc().style.height = this.height
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

/** Accordion class */
if(Konekti.accordion === undefined) new AccordionPlugIn()

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
	return Konekti.build(Konekti.plugin['accordion'].setup(id, icon, caption, h, style, content, open))
}

/** Konekti Plugin for TOC (Table of content) components */
class TocPlugIn extends PlugIn{
	/** Creates a Plugin for TOC components */
	constructor(){ super('toc') }

	/**
	 * Creates a TOC configuration object
	 * @method
	 * tocConfig
	 * @param tree Table of Content component 
	 * @param h Size of the main content (1,2,3..) recommended 3 or 4, maximum 6
	 * @param style Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param open If toc component should be displayed or not
	 * @param parent Parent component
	 */
	setup(tree, h, style, onclick, open, parent='KonektiMain'){
		h = Math.min(h,6)
		var content =null
		if(tree.children !== undefined){
			content = Konekti.plugin['div'].setup(tree.id+'Content', '', '', '', '', tree.id)		
			content.children = []
			for( var i=0; i<tree.children.length; i++ ){
				content.children.push(Konekti.plugin['toc'].setup(tree.children[i], h+1, style, onclick, false, tree.id+'Content'))
			}
		}
		var item = super.setup(tree.id, tree.icon, tree.caption, h, style, content, open, parent)
		if(tree.action === undefined) tree.action = true
		item.expand = tree.action?onclick:function(id){}
		return item
	}
}

/** Accordion class */
if(Konekti.toc === undefined) new TocPlugIn()

/**
 * Associates/adds a table of contents
 * @method
 * btn
 * @param tree Table of Content component 
 * @param h Size of the main content (1,2,3..)
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param open If toc component should be displayed or not
 */
Konekti.toc = function(tree, h, style, onclick, open){
	return Konekti.build(Konekti.plugin['toc'].setup(tree, h, style, onclick, open))
}