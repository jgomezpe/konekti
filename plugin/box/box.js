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
	 */
	connect(thing){
		thing.gui = this.html(thing)
		function back(){ 
			if( thing.args!==undefined ) Konekti[thing.inner](...thing.args)
			else Konekti[thing.inner.plugin](thing.inner)
		}
		Konekti.uses((typeof thing.inner==='string')?thing.inner:thing.inner.plugin,back)
		return null
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
		if( plugin===undefined || typeof plugin === 'string' ){
			var args = [id]
			for( var i=4; i<arguments.length; i++ )
				args.push(arguments[i])
			return {"id":id,"args":args,"inner":plugin||"html", "sty":sty, "cl":cl}
		}else{
			plugin.id = plugin.id || id
			return {"id":id,"inner":plugin, "sty":sty, "cl":cl}
		}
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
	if( typeof id === 'string' ) id = Konekti.plugins.box.config(...arguments)
	return Konekti.plugins.box.connect(id)
}

/** Box class */
new BoxPlugIn()

