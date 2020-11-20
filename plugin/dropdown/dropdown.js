/** Konekti Plugin for DropDown components */
class DropDownPlugIn extends KonektiPlugIn{
	/** Creates a Plugin for Dropdown components */
	constructor(){
		super('dropdown')
		this.replace = 'strict'
	}
    
	/**
	 * Fills the html template with the specific dropdown information
	 * @param thing Dropdown information
	 * @return Html code associated to the dropdown
	 */
	fillLayout(thing){
		var id = thing.id
		thing.onclick = {"method":"drop", "client":id}
		thing.id += '-btn'
		thing.caption = thing.caption || ''
		thing.icon = thing.icon || ''
		thing.style = thing.style || 'w3-bar-item w3-xlarge'
		var template = this.htmlTemplate.replace('·btn·',Konekti.plugin.btn.fillLayout(thing))
		Konekti.plugin.btn.client(thing.id)
		thing.id = id
		var option = thing.options
		var size = Konekti.core.previousFont(thing.style)
		for( var i=0; i<option.length; i++ ){
			if( typeof option[i] == 'string') option[i] = {"id":option[i], "caption":option[i]}
			option[i].style = size
			option[i].onclick = {"client":thing.id, "method":"select"}
		}
		thing.btn = option
		thing.drop = Konekti.plugin.btn.listLayout(thing)
		return Konekti.core.fromTemplate(template, thing)
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
		this.option = thing.options
		this.method = thing.method || 'select'
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
		if( c !== undefined && c[this.method] !== undefined ) 
			c[this.method](((this.addID!==undefined && this.addID==true)?this.id+'-':'')+option)
	}

    /**
     * updates the html associated to a dropdown
     * @param thing Dropdown configuration
     */
    update(thing){
	var id = thing.id 
	Konekti.client(id+'-btn').update(thing) 	
	thing.id = id
        if( thing.options !== undefined) Konekti.core.update({"components":thing.options})
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
