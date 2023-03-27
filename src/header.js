/** Konekti plugin for header elements */
class HeaderPlugin extends PlugIn{
	constructor(){ super('header') }

	/**
	 * Creates a Header configuration object
	 * @param parent Parent component
	 * @param id Id of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (0, 1, 2, 3, 4, 5, or 6)
	 * @param config Style of the header
	 */
	setup(parent, id, icon, caption, h, config={}){
		config.tag = 'h'+h
		config = this.style(config)
		var fs = Konekti.font.fromHeader(h) + 'px'
		config.width = '100%'
		config.style['margin-top'] = 0
		config.style['margin-bottom'] = 0
		config.style['padding'] = '2px'
		return super.setup(parent, id, [{'plugin':'item', 'setup': [id+'Item', icon, caption, {'width':'100%', 'style':{'font-size':fs}}]}], config)
	}

	client(config){ return new Header(config) }
}

/** Adds the header plugin to Konekti */
new HeaderPlugin()

/** A Header manager */
class Header extends Client{

	/**
	 * Creates a Header configuration object
	 */
	constructor(config){ super(config) }
}

/**
 * Associates/adds a header
 * @method
 * header
 * @param id Id of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param h Size of the header (1,2,3..)
 * @param style Style of the header
 * @param callback Function called when the header is ready
 */
Konekti.header = function(id, icon='', caption='', h=4, style={}, callback=function(){}){ 
	Konekti.add({'plugin':'header', 'setup':['body', id, icon, caption, h, style]}, callback)
}