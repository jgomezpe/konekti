uses('header')

/** Konekti Plugin for Accordion components */
class AccordionPlugIn extends PlugIn{
	/** Creates a Plugin for Accordion components */
	constructor(id){ super(id!==undefined?id:'accordion') }

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
	}

	setChildrenBack(children,config){
		super.setChildrenBack(children,config)
		var x = this
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