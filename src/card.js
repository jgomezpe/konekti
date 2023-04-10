/** Konekti plugin for card elements */
class CardPlugin extends PlugIn{
	constructor(){ super('card') }
	/**
	 * Creates a card configuration object
	 * @param parent Parent component
	 * @param id Id of the card component
	 * @param description Contained components with description of the product/person
	 */
	 setup( parent, id, description, config={} ){
		console.log(config)
		config.class = "w3-container w3-center " + (config.class||'') 
        var content = {'plugin':'raw', 'setup':[id+'Content', description, {'class':"w3-card", 'width':'100%', 'height':'100%'}]}
		return super.setup(parent, id, [content], config) 
	}
}

/** Registers the card plugin in Konekti */
new CardPlugin()

/**	 
 * Creates a card component 
 * @param id Id of the card
 * @param description Contained components with description of the product/person
 * @param parent Parent component
 * @param config Card configuration
 * @param callback Function called when the navbar is ready
 */	
Konekti.card = function( id, description, config={}, callback=function(){}){ 
	Konekti.add({'plugin':'card', 'setup':['body', id, description, config]}, callback)
}
