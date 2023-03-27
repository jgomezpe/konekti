/** Konekti plugin for button elements */
class BtnPlugin extends PlugIn{
	constructor(){ super('btn') }

	/**
	 * Creates a button configuration object
	 * @param parent Parent component
	 * @param id Id of the button
	 * @param icon Icon for the button
	 * @param caption Caption of the button
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param config Style of the button
	 */
	 setup(parent, id, icon, caption, onclick='', config={}){
		config.tag = 'div'
		if(onclick!='') config.onclick = Konekti.dom.onclick(id,onclick)
		config.class = (config.class||"") + " w3-button "
		return super.setup(parent, id, [{'plugin':'item', 'setup': [id+'Item', icon, caption]}], config)
	}

	client(config){ return new Btn(config) }
}

/** Registers the btn plugin in Konekti */
new BtnPlugin()

/** A Button manager */
class Btn extends Client{

	/**
	 * Creates a button configuration object
	 */
	constructor(config){ super(config) }

	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(icon, caption, title){
		Konekti.client[this.id+'Item'].update(icon, caption)
		if( title !== undefined ) this.vc().title = title
	}
}

/**
 * Associates/adds a header
 * @method
 * btn
 * @param parent Parent component
 * @param id Id of the button
 * @param icon Icon for the button
 * @param caption Caption of the button
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param config Style of the button
 * @param callback Function called when the btn is ready
 */
Konekti.btn = function(parent, id, icon, caption, onclick, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = ''
	if(args.length==4) args[4] = ''
	if(args.length==5) args[5] = {}
	if(args.length==6) args[6] = function(){}
	Konekti.add('btn', ...args)
}