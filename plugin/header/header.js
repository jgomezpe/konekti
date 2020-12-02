/** Konekti Plugin for Header components */
class HeaderPlugIn extends KonektiPlugIn{
	/** Creates a Plugin for Header components */
	constructor(){ 
		super('header') 
		this.replace = 'strict'
	}
    
	/**
	 * Fills the html template with the specific header information
	 * @param thing Header information
	 * @return Html code associated to the header
	 */
	fillLayout(thing){
		this.addItemHTML()
		
		thing.style = thing.style || 'w3-center w3-blue'
		thing.h = thing.h || 3
		return Konekti.core.fromTemplate( this.htmlTemplate, thing )
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Header(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the header 
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param style Style of the header
	 */
	config(id, icon='', caption='', h=3, style='w3-center w3-blue' ){
	    return {"id":id, "caption":caption, "h":h, "style":style, "icon":icon}
	}
}

/** A Header manager */
class Header extends KonektiClient{
	/** 
	 * Creates a Header Manager
	 * @param thing Configuration of the header
	 */
	constructor(thing){ super(thing) }

	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){
		var c = this.vc('-icon')
		if( thing.caption !== undefined ) c.nextSibling.data = " "+thing.caption
		if( thing.icon !== undefined ) c.className = thing.icon
		c = this.vc()
		if( thing.style !== undefined ) c.className = thing.style
	}
}

/** Header class */
new HeaderPlugIn()

/**
 * Associates/adds a header
 * @method
 * Konekti header
 * @param id Id of the header/Configuration of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param h Size of the header (1,2,3..)
 * @param style Style of the header
 */
Konekti.header = function(id, icon, caption, h, style){
    if(typeof id==='string') id=Konekti.plugin.header.config(id,icon,caption,h,style)
    return Konekti.plugin.header.connect(id)
}
