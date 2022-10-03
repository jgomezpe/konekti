/** Konekti plugin for header elements */
class HeaderPlugin extends PlugIn{
	constructor(){ super('header') }

	/**
	 * Creates a Header configuration object
	 * @param parent Parent component
	 * @param id Id of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param config Style of the header
	 */
	setup(parent, id, icon, caption, h, config={}){
		config.tag = 'h'+h
		config.style = config.style || "margin-top:0;margin-bottom:0;padding:2px"
		return super.setup(parent, id, [{'plugin':'item', 'setup': [id+'Item', icon, caption, {'style':'width:100%;'}]}], config)
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
 * @param parent Parent component
 * @param id Id of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param h Size of the header (1,2,3..)
 * @param style Style of the header
 * @param callback Function called when the header is ready
 */
Konekti.header = function(parent, id, icon, caption, h, style, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = ''
	if(args.length==4) args[4] = 4
	if(args.length==5) args[5] = {}
	if(args.length==6) args[6] = function(){}
	Konekti.add('header', ...args)
}