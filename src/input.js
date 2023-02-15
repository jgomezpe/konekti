/** Konekti plugin for input list elements */
class InputPlugin extends PlugIn{
	constructor(){ super('input') }

	/**
	 * Creates an input-list configuration object
	 * @param parent Parent component
	 * @param id Id of the input-list
	 * @param onenter Method that will be executed when the enter key is pressed
	 * @param config Style of the input-list
	 */
	setup(parent, id, onenter='', config={}){
		config.tag = 'input'
		config.class = (config.class||"") + " w3-input "
		config.style = 'font-family: FontAwesome, Arial, Verdana, sans-serif;'+(config.style || '')

		config.placeholder = (config.placeholder || '')
		config.name = id
		var c = super.setup(parent, id, '', config)
		c.onenter = onenter
		return c
	}

	client(config){ return new Input(config) }
}

/** Registers the input plugin in Konekti */
new InputPlugin()

/** An Input manager */
class Input extends Editor{

	/**
	 * Creates an input client
	 */
	constructor(config){ 
		super(config)
		var x = this
		x.vc().onchange = function(){ eval(Konekti.dom.onclick(x.vc().value,x.onenter)) }
	}

	/**
	 * Gets current text in the editor
	 * @return Current text in the editor
	 */
	getText(){ return x.vc().value }

	/**
	 * Sets text in the editor
	 * @param text Text to set in the editor
	 */
	setText(txt){ x.vc().value = txt }
}

/**
 * Associates/adds an input
 * @method
 * input
 * @param parent Parent component
 * @param id Id of the inputlist
 * @param onenter Method that will be executed when the enter key is pressed
 * @param config Style of the inputlist
 * @param callback Function called when the inputlist is ready
 */
Konekti.input = function(parent, id, onenter, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==2) args[2] = ''
	if(args.length==3) args[3] = {}
	if(args.length==4) args[4] = function(){}
	Konekti.add('input', ...args)
}