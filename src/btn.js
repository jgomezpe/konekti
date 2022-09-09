/** Konekti Plugin for buttons */
class BtnPlugIn extends PlugIn{
	/** Creates a Plugin for buttons */
	constructor(){ super('btn') }

    /**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client( config ){ return new Btn(config) }


}

/** A Button manager */
class Btn extends Client{
	/**
	 * Creates a button configuration object
	 * @param id Id of the header/Configuration of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param style Style of the header
	 * @param title Message that will be shown when mouse is over the button
	 * @param parent Parent component
	 */
	 setup(id, icon, caption, onclick, style, title, parent='KonektiMain'){
		var config = id
		if(typeof id == 'string')
			config = {'id':id, 'style':style, 'run':onclick, 'title':title, 'parent':parent, 'children':[Konekti.plugin['item'].setup(id+'Item', icon, caption, id)]}
		config.plugin = 'btn'
		return config
	}

	/**
	 * Creates a button configuration object
	 * @param id Id of the header/Configuration of the header
	 * @param icon Icon for the header
	 * @param caption Caption of the header
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param style Style of the header
	 * @param title Message that will be shown when mouse is over the button
	 * @param parent Parent component
	 */
	constructor(id, icon, caption, onclick, style, title, parent='KonektiMain'){ super(...arguments) }

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html(){ 
		var title = this.config.title || ''
		var style = this.config.style || ''
		var run = this.config.run || ''
		if( typeof run !== 'string' ){
			var client = this.config.run.client
			this.config.run.method = this.config.run.method || this.id
			run = ((client!==undefined && client!==null && client!=='')?'Konekti.client["'+client+'"].':'')+this.config.run.method+'("'+this.id+'")'
		} 
		this.config.config = " title='"+title+"' class='w3-button "+style+"' onclick='"+run+"'"
		return "<div id='" + this.id + "' "+ this.config.config + "></div>"
	}
	
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
 * @param id Id of the header/Configuration of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param style Style of the header
 * @param title Message that will be shown when mouse is over the button
 */
Konekti.btn = function(id, icon, caption, onclick, style, title){
	return new Btn(id, icon, caption, onclick, style, title)
}