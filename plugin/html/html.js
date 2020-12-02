/** Konekti Plugin for Html components */
class HTMLPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for html components */
    constructor(){ super('html') }    

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new DIVEditor(thing.id) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the html container
	 * @param initial Initial code for the html component
	 */
	config(id, initial=''){ return {'id':id, 'initial':initial} }
}

new HTMLPlugIn()

/** HTML component that works as an editor */
class DIVEditor extends KonektiEditor{
	/**
	 * Creates a div component that works as an editor
	 * @param id Id of the div component
	 */
	constructor(id){ super(id) }
    
	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){ if( thing.initial !== undefined ) this.setText( thing.initial ) }

	/**
	 * Gets current html code in the div component
	 * @return Current html code in the div component
	 */
	getText(){ return this.gui.innerHTML }

	/**
	 * Sets html code for the div component
	 * @param txt Html code to set in the div component
	 */
	setText(txt){ this.gui.innerHTML = txt }
}


/**
 * @function
 * Konekti html
 * @param id Id/Configuration of the html container
 * @param code Code for the html component
 */
Konekti.html = function(id, code){
	if(typeof id === 'string') id=Konekti.plugin.html.config(id,code)
	return Konekti.plugin.html.connect(id)
}
