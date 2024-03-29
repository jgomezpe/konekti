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
		config.tag = 'div'
		config.class = "w3-container w3-center " + (config.class||'') 
        var content = {'plugin':'raw', 'setup':[id+'Content', description, {'class':"w3-card", 'tag':'div', 'style':'width:100%;height:100%;'}]}
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
Konekti.card = function( parent, id, description, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = {}
	if(args.length==4) args[4] = function(){}
	Konekti.add('card', ...args)
}
