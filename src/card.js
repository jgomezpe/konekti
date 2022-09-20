/** A Konekti card (product datasheet/person information). */
class Card extends Container{
	/**
	 * Creates a card configuration object
	 * @param id Id of the card component
	 * @param description Contained components with description of the product/person
	 * @param parent Parent component
	 */
	setup( id, description, parent='KonektiMain' ){
        var plug = 'container'
        if(typeof description == 'string') plug = 'div'
        else if(!Array.isArray(description)) description = [description]
        var content = {'plugin':plug, 'setup':[id+'Content', '100%', '100%', 'class="w3-card"', description, id]}
		return {'plugin':'card', 'id':id, 'width':'', 'height':'', 'config':'class="w3-container w3-center"', 'children':[content], 'parent':parent} 
	}

	/**
	 * Creates a card component
	 * @param id Id of the card component
	 * @param description Contained components with description of the product/person
	 * @param parent Parent component
	 */
     constructor( id, description, parent='KonektiMain' ){ super(...arguments) }
}

/**	 
 * Creates a card component 
 * @param id Id of the card
 * @param description Contained components with description of the product/person
 * @param parent Parent component
 */	
Konekti.card = function( id, description, parent='KonektiMain' ){ 
    return new Card(id, description, parent) 
}