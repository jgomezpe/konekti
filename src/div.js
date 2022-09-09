/** Konekti Div Client */
class DivClient extends Editor{
	/**
	 * Div configuration object
 	 * @param id Id of the div component
 	 * @param width Width of the div's component
 	 * @param height Height of the div's component
	 * @param config Extra configuration of the div's component (html code: that uses character ' as delimiter)
 	 * @param inner Inner html code of the div's component (html code: that uses character ' as delimiter)
 	 * @param parent Parent component
 	 */
 	setup(id, width, height, config='', inner='', parent='KonektiMain'){
		return {'plugin':'div', 'id':id, 'width':width, 'height':height, 'config':config, 'parent':parent, 'inner':inner}
	}

	/** 
	 * Creates a Div client
 	 * @param id Id of the div component
 	 * @param width Width of the div's component
 	 * @param height Height of the div's component
	 * @param config Extra configuration of the div's component (html code: that uses character ' as delimiter)
 	 * @param inner Inner html code of the div's component (html code: that uses character ' as delimiter)
 	 * @param parent Parent component
	 */
	constructor( id, width, height, config='', inner='', parent = 'KonektiMain'  ){ super(...arguments) }
	
	/**
	 * Gets current html code in the div component
	 * @return Current html code in the div component
	 */
	getText(){ return this.vc().innerHTML }

	/**
	 * Sets html code for the div component
	 * @param txt Html code to set in the div component
	 */
	setText(txt){ this.vc().innerHTML = txt }

	/**
	 * Associated html code
	 */
	 html(){ return "<div id='" + this.id + "' "+ this.config.config + ">" + this.config.inner + "</div>" }
}

/**
 * Associates/adds Div panel
 * @method
 * div
 * @param id Id of the div component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param config Extra configuration of the div's component (html code: that uses character ' as delimiter)
 * @param inner Inner html code of the div's component (html code: that uses character ' as delimiter)
 */
Konekti.div = function( id, width, height, config='', inner='' ){ return new DivClient(id, width, height, config, inner) }