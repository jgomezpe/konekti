/** A Header manager */
class Header extends Container{
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
		return {'plugin':'header', 'id':id, 'style':style, 'h':h, 'parent':parent, 'children':[{'plugin':'item', 'setup': [id+'Item', icon, caption, id]}]}
	}

	/**
	 * Creates a Header configuration object
	 * @param id Id of the header/Configuration of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param h Size of the header (1,2,3..)
	 * @param style Style of the header
	 * @param parent Parent component
	 */
	constructor(id, icon, caption, h, style, parent='KonektiMain'){ super(...arguments) }

	/**
	 * Associated html code
	 */
	html(){ return "<h"+this.config.h+" id='"+this.id+"' class='"+this.config.style+"' style='margin-top:0;margin-bottom:0;padding:2px'></h"+this.config.h+">" }   
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
Konekti.header = function(id, icon, caption, h, style, parent='KonektiMain'){
	return new Header(id, icon, caption, h, style, parent)
}