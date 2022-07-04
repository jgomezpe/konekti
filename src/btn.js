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
	 * Creates a Button Manager
	 * @param config Configuration of the button
	 */
	constructor(config){ super(config) }

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ 
		var title = config.title || ''
		var style = config.style || ''
		var run = config.run || ''
		if( typeof run !== 'string' ){
			var client = config.run.client
			config.run.method = config.run.method || this.id
			run = ((client!==undefined && client!==null && client!=='')?'Konekti.client["'+client+'"].':'')+config.run.method+'("'+this.id+'")'
		} 
		config.config = " title='"+title+"' class='w3-button "+config.style+"' onclick='"+run+"'"
		return super.html(config)
	}
}

/** Creates and registers the button plugin */
if( Konekti.btn === undefined ) new BtnPlugIn()

/**
 * Creates a button configuration object
 * @method
 * btnConfig
 * @param id Id of the header/Configuration of the header
 * @param icon Icon for the header
 * @param caption Caption of the header
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param style Style of the header
 * @param title Message that will be shown when mouse is over the button
 * @param parent Parent component
 */
Konekti.btnConfig = function(id, icon, caption, onclick, style, title, parent='KonektiMain'){
	return {'plugin':'btn', 'id':id, 'style':style, 'run':onclick, 'title':title, 'parent':parent, 'children':[{'plugin':'item', 'id':id+'Item', 'icon':icon, 'caption':caption, 'parent':id}]}
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
	return Konekti.build(Konekti.btnConfig(id, icon, caption, onclick, style, title))
}