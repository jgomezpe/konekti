/** Konekti Plugin for boxes (containers) */
class BoxPlugIn extends PlugIn{
	/** Creates a Plugin for sidebar applications */
	constructor(){
		super('box')
		this.replace = 'strict'
	}

	/**
	 * Provides to a visual component the plugin's functionality 
	 * @param thing Plugin instance information
	 * @param callback Function that will be executed as the box component is loaded
	 */
	connect(thing, callback){
		thing.gui = this.html(thing)
		function back(){ 
			if( thing.args!==undefined ) Konekti[thing.inner](...thing.args)
			else Konekti[thing.inner.plugin](thing.inner)
			if(callback !== undefined ) callback()
		}
		var luse = Konekti.analize(thing.inner)
		if(typeof thing.inner==='string')
			Konekti.load(thing.inner,back)
		else 
			Konekti.load(...luse,back)
		return null
	}

	/**
	 * Creates a config object from parameters
	 * @param thing Configuration of the box component
	 * @param cl Box class
	 * @param sty Box style
	 * @param plugin Component connected to the box
	 */
	config(id, cl, sty, plugin){
		plugin.id = plugin.id || id
		return {"id":id,"inner":plugin, "sty":sty, "cl":cl}
	}
}

/** Box class */
if( Konekti.box === undefined ) new BoxPlugIn()

/**
 * Associates/adds a box component
 * @method
 * box
 * @param id Id/Configuration of the box component
 * @param cl Box class or Function that will be executed as the box component is loaded 
 * @param sty Box style
 * @param plugin Component connected to the box
 * @param callback Function that will be executed as the box component is loaded
 */
Konekti.box = function(id, cl, sty, plugin, callback){
	if( typeof id === 'string' ) id = Konekti.plugins.box.config(...arguments)
	else callback = cl
	return Konekti.plugins.box.connect(id, callback)
}


