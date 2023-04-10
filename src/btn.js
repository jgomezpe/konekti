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
		config = Konekti.config(config)
		if(onclick!='') config.onclick = Konekti.dom.onclick(id,onclick)
		config.class = (config.class||"") + " w3-button "
		var fs = Konekti.font.size(config) 
		if(fs == null ) fs = Konekti.font.fromClass('w3-large')
		return super.setup(parent, id, [{'plugin':'item', 'setup': [id+'Item', icon, caption, {'style':{'width':'100%', 'font-size':fs+ 'px'}}]}], config)
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
 * @param id Id of the button
 * @param icon Icon for the button
 * @param caption Caption of the button
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param config Style of the button
 * @param callback Function called when the btn is ready
 */
Konekti.btn = function(id, icon='', caption='', onclick='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'btn', 'setup':['body', id, icon, caption, onclick, config]},callback)
}