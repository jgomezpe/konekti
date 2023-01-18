/** A Konekti fillrest plugin. */
class FillRestPlugin extends PlugIn{
	constructor(){ super('fillrest') }

	/**
	 * Creates a fillrest configuration object
	 * @param parent Parent component
	 * @param id Id of the fillrest component
	 * @param type If filling the rest of the parents's height (<i>'height'</i>) or the width (<i>'width'</i>)
	 * @param children Children elements of the component
	 */
	setup( parent, id, type='height', children=[], config={} ){
		config.class = "konektifillrest " + (config.class || '')
		var c = super.setup(parent, id, children, config)
		c.type = type
		return c
	}

	client(config){ return new FillRest(config) }
}

/** Registers the fillrest plugin in Konekti */
let fillrestplugin = new FillRestPlugin()

/** A Konekti grid. */
class FillRest extends Client{
	/**
	 * Creates a grid configuration object
	 */
    constructor(){ 
		super(...arguments)
		var x = this
		var tout
		function check(){
			var c = Konekti.client[x.parent]
			if(c !== undefined && c !== null){
				clearTimeout(tout)
				c.startResizeObserver(x.type)
			}else tout = setTimeout(check, Konekti.TIMER)
		}
		check()
	}
}

/**	 
 * Creates a fillrest configuration object
 * @param parent Parent component
 * @param id Id of the fillrest component
 * @param type If filling the rest of the parents's height (<i>'height'</i>) or the width (<i>'width'</i>)
 * @param children Contained components
 * @param callback Function called when the fillrest component is ready
 */	
Konekti.fillrest = function( parent, id, type, children, config, callback ){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==2) args[2] = 'height'
	if(args.length==3) args[3] = []
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('fillrest', ...args)
}