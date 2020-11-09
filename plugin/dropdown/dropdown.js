/** Konekti Plugin for DropDown components */
class DropDownPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for Dropdown components */
    constructor(){
        super('dropdown')
        this.replace = 'strict'
    }
    
    splitTemplate(){
        var k = this.htmlTemplate.indexOf("</div>\n<div") + 7
        this.itemTemplate = this.htmlTemplate.substring(0,k)
        this.htmlTemplate = this.htmlTemplate.substring(k)
    }

    /**
     * Fills the html template with the specific dropdown information
     * @param thing Dropdown information
     * @return Html code associated to the dropdown
     */
    fillLayout(thing){
        if( this.itemTemplate === undefined ) this.splitTemplate()
        thing.caption = thing.caption || ''
        thing.style = thing.style || 'w3-bar-item w3-xlarge'
        thing.icon = thing.icon || ''
        var optTemplate = ''
        var option = thing.options
	var size = Konekti.core.previousFont(thing.style)
        for( var i=0; i<option.length; i++ ){
            if( typeof option[i] == 'string'){
                option[i] = {"id":option[i], "caption":option[i]}
            }
		option[i].size = size
            option[i].client = thing.id
            optTemplate += Konekti.core.fromTemplate(this.itemTemplate, option[i])
        }
        thing.drop = optTemplate
        return Konekti.core.fromTemplate(this.htmlTemplate, thing)
    }

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new DropDown(thing) }

}

new DropDownPlugIn()

/** A Dropdown component */
class DropDown extends KonektiClient{
	/**
	 * Creates a dropdown component
	 * @param thing Dropdown configuration
	 */
	constructor( thing ){
		super(thing)
		this.client_select = thing.select || 'select'
		this.client = thing.client || 'client'
	}
	
	/**
	 * Shows/hides the drop option list
	 */
	drop(){
		var x = Konekti.vc(this.id+'-drop')
		if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
		else x.className = x.className.replace(" w3-show", "")
	}
	
	/**
	 * Runs the code associated to the selected option
	 * @param option Seleted option
	 */
	select( option ){
		this.drop()
		var c = Konekti.client(this.client)
		if( c !== undefined && c[this.client_select] !== undefined ) 
			c[this.client_select](this.id+'-'+option)
	}
}

/**
 * @function
 * Konekti dropdown
 * @param thing Dropdown configuration
 */
Konekti.dropdown = function(thing){
	return Konekti.plugin.dropdown.connect(thing)
}
