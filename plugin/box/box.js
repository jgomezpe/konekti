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
	 * @param id Id/Configuration of the box component
	 * @param cl Box class
	 * @param sty Box style
	 * @param plugin Component connected to the box
	 * @param ... Component specific parameters
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

/**
 * Associates/adds a box component
 * @method
 * box
 * @param id Id/Configuration of the box component
 * @param cl Box class
 * @param sty Box style
 * @param plugin Component connected to the box
 * @param ... Component specific parameters
 */
Konekti.box = function(id, cl, sty, plugin){
	if( typeof id === 'string' ) id = Konekti.plugin.box.config(...arguments)
	return Konekti.plugin.box.connect(id)
}

/** Box class */
new BoxPlugIn()

