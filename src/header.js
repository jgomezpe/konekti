/** Konekti Plugin for Header components */
class HeaderPlugIn extends PlugIn{
	/** Creates a Plugin for Header components */
	constructor(){ super('header') }
    
	/**
	 * Creates a Header configuration object
	 * @method
	 * headerConfig
	 * @param id Id of the header/Configuration of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param style Style of the header
	 * @param parent Parent component
	 */
	setup(id, icon, caption, h, style, parent='KonektiMain'){
		var config = id
		if(typeof id == 'string') 
			config = {'id':id, 'style':style, 'h':h, 'parent':parent, 'children':[Konekti.plugins['item'].setup(id+'Item', icon, caption, id)]}
		config.plugin = 'item'
		return config
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client( config ){ return new Header(config) }
}

/** A Header manager */
class Header extends Client{
	/** 
	 * Creates a Header Manager
	 * @param config Configuration of the header
	 */
	constructor(config){ super(config) }

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<h"+config.h+" id='"+this.id+"' class='"+config.style+"' style='margin-top:0;margin-bottom:0;padding:2px'></h"+config.h+">" }   
}

/** Header class */
if(Konekti.header===undefined) new HeaderPlugIn()

/**
 * Associates/adds a header
 * @method
 * header
 * @param id Id of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param h Size of the header (1,2,3..)
 * @param style Style of the header
 */
Konekti.header = function(id, icon, caption, h, style){
	return Konekti.build(Konekti.plugin['header'].setup(id, icon, caption, h, style))
}