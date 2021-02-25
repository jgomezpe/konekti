/** Konekti Plugin for DropDown components */
class DropDownPlugIn extends PlugIn{
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
		var template = this.htmlTemplate.replace('·btn·',Konekti.plugins.btn.fillLayout(thing))
		Konekti.plugins.btn.client(thing.id)
		thing.id = id
		var option = thing.options
		var size = Konekti.dom.previousFont(thing.style)
		for( var i=0; i<option.length; i++ ){
			if( typeof option[i] == 'string') option[i] = {"id":option[i], "caption":option[i]}
			option[i].style = size
			option[i].onclick = {"client":thing.id, "method":"select"}
		}
		thing.btn = option
		thing.drop = Konekti.plugins.btn.listLayout(thing)
		return Konekti.dom.fromTemplate(template, thing)
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new DropDown(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the dropdown
	 * @param icon Icon of the dropdown
	 * @param caption Caption of the dropdown
	 * @param options List of options
	 * @param client Client listening to the dropdown
	 * @param method Method of the client listening to selection of options
	 * @param addID Indicates if the id of the selected option that is sent to the client includes the dropdown id or not
	 * @param style Style of the dropdown
	 * @param title Message that will be shown when mouse is over the dropdown
	 */
	config(id, icon, caption, options, client='client', method='select', 
		addID=false, style='w3-bar-item w3-xlarge', title=''){
		return {'id':id, 'icon':icon, 'caption':caption, 'options':options, 'client':client,
			 'method':method, 'addID':addID, 'style':style, 'title':title}
	}
}

/** A Dropdown component */
class DropDown extends Client{
	/**
	 * Creates a dropdown component
	 * @param thing Dropdown configuration
	 */
	constructor( thing ){
		super(thing)
		this.option = thing.options
		this.method = thing.method || 'select'
		this.client = thing.client || 'client'
		this.addID = thing.addID || false
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
        if( thing.options !== undefined) Konekti.dom.update({"components":thing.options})
    }
}

/** DropDown class */
if(Konekti.dropdown === undefined) new DropDownPlugIn()

/**
 * Associates/Adds a dropdown
 * @method
 * dropdown
 * @param id Id/Configuration of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param options List of options
 * @param client Client listening to the dropdown
 * @param method Method of the client listening to selection of options
 * @param addID Indicates if the id of the selected option that is sent to the client includes the dropdown id or not
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 */
Konekti.dropdown = function(id, icon, caption, options, client, method, addID, style, title){
	if(typeof id === 'string') id=Konekti.plugins.dropdown.config(id,icon,caption,options,client,method,addID,style,title)
	return Konekti.plugins.dropdown.connect(id) 
}
