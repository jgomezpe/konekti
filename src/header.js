/** A Header manager */
class Header extends Container{
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
		return super.setup(parent, 'header', id, [{'plugin':'item', 'setup': [id+'Item', icon, caption]}], '', '', config)
	}

	/**
	 * Creates a Header configuration object
	 */
	constructor(){ super(...arguments) }
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
 * @param parent Parent component
 */
Konekti.header = function(parent, id, icon, caption, h, style ){
	return new Header(parent, id, icon, caption, h, style)
}