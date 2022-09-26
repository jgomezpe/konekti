/** A Konekti card (product datasheet/person information). */
class Card extends Container{
	/**
	 * Creates a card configuration object
	 * @param parent Parent component
	 * @param id Id of the card component
	 * @param description Contained components with description of the product/person
	 */
	setup( parent, id, description, config={} ){
		config.tag = 'div'
        var content = {'plugin':'container', 'setup':['container', id+'Content', description, '100%', '100%', {'class':"w3-card", 'tag':'div'}]}
		return super.setup(parent, 'card', id, [content], '', '', {'class':"w3-container w3-center"}) 
	}

	/**
	 * Creates a card component
	 */
     constructor(){ super(...arguments) }
}

/**	 
 * Creates a card component 
 * @param id Id of the card
 * @param description Contained components with description of the product/person
 * @param parent Parent component
 * @param config Card configuration
 */	
Konekti.card = function( parent, id, description, config={} ){ 
    return new Card(parent, id, description, config) 
}