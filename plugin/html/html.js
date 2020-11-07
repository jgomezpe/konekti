/** Konekti Plugin for Html components */
class HTMLPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for html components */
    constructor(){ super('html') }    

    /** 
     * Connects (extra steps) the html component with the GUI component
     * @param thing Html component configuration
     */
    extra( thing ){ new DIVEditor(thing.id) }
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
 * @param id Id of the html container
 * @param code Code for the html component
 * @param client Client of the html component
 */
Konekti.html = function(id, code, client='client'){
	Konekti.plugin.html.connect( {'id':id, 'initial':code, 'client':client} )
}
