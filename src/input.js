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
		config = this.style(config)
		config.style['font-family'] ='FontAwesome, Arial, Verdana, sans-serif'
		config.class = (config.class||"") + " w3-input "

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
	getText(){ return this.vc().value }

	/**
	 * Sets text in the editor
	 * @param text Text to set in the editor
	 */
	setText(txt){ this.vc().value = txt }
}

/**
 * Associates/adds an input
 * @method
 * input
 * @param id Id of the inputlist
 * @param onenter Method that will be executed when the enter key is pressed
 * @param config Style of the inputlist
 * @param callback Function called when the inputlist is ready
 */
Konekti.input = function(id, onenter='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'input', 'setup':['body', id, onenter, config]}, callback)
}