/** Konekti Plugin for boxes (containers) */
class BoxPlugIn extends KonektiPlugIn{
	/** Creates a Plugin for sidebar applications */
	constructor(){
		super('box')
		this.replace = 'strict'
	}

	/**
	 * Provides to a visual component the plugin's functionality 
	 * @param thing Plugin instance information
	 */
	connect(thing){
		thing.gui = this.html(thing)
		function back(){ Konekti[thing.plugin](...thing.args) }
		thing.plugin = thing.plugin || 'html'
		Konekti.core.uses(thing.plugin,back)
		return this.client(thing)
	}

	/**
	 * Creates a config object from parameters
	 * @param id Id/Configuration of the box component,
	 * @param plugin Plugin connected to the box
	 * extra parameters are specific for the plugin
	 */
	config(id, cl, sty, plugin){
		var args = [id]
		for( var i=4; i<arguments.length; i++ )
			args.push(arguments[i])
		var thing = {}
		thing.id = id
		thing.args = args
		thing.plugin = plugin
		thing.sty = sty
		thing.cl = cl
		return thing
	}
}

new BoxPlugIn()

/**
 * @function
 * Konekti hcf
 * @param id Id/Configuration of the box component,
 * @param plugin Plugin connected to the box
 * extra parameters are specific for the plugin
 */
Konekti.box = function(id, cl, sty, plugin){
	if( typeof id === 'string' ) id = Konekti.plugin.box.config(...arguments)
	return Konekti.plugin.box.connect(id)
}
