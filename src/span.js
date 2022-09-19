/** A Konekti span. */
class Span extends Container{
	/**
	 * Creates a span configuration object
	 * @param id Id of the span component
	 * @param config Extra configuration 
	 * @param children Contained components
	 * @param parent Parent component
	 */
	setup( id, config, children, parent='KonektiMain' ){ 
		return {'plugin':'span', 'id':id, 'width':'', 'height':'', 'config':config, 'children':children, 'parent':parent} 
	}

	/**	 
	 * Creates a span client 
	 * @param id Id of the span
	 * @param config Extra configuration of the span component
	 * @param children Contained components
	 * @param parent Parent component
	 */	
	constructor( id, config, children=[], parent='KonektiMain' ){ super(...arguments) }

	/**
	 * Associated html code
	 */
	html(){ return "<span id='"+this.id+"' " + (this.config.config||"") + "></span>" }
}

/**	 
 * Creates a span client 
 * @param id Id of the span
 * @param config Extran configuration of the span component
 * @param children Contained components
 * @param parent Parent component
 */	
Konekti.span = function( id, config, children, parent='KonektiMain' ){ 
    return new Span(id, config, children, parent) 
}