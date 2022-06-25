Konekti.uses('btn')

/** Konekti Plugin for DropDown components */
class DropDownPlugIn extends PlugIn{
	/** Creates a Plugin for Dropdown components */
	constructor(){ super('dropdown') }    

	/**
	 * Gets a client for a Dropdown component
	 * @param config Dropdown configuration
	 */  
	client( config ){ return new DropDown(config) }    
}

/** A Dropdown component */
class DropDown extends Client{
	/**
	 * Creates a dropdown component
	 * @param config Dropdown configuration
	 */
	constructor( config ){ super(config) }
	
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<div id='"+this.id+"' class='w3-dropdown-click w3-bar-block'></div>" }   

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new DropDown(thing) }

	/**
	 * Shows/hides the drop option list
	 */
	drop(){
		var x = this.vc('Drop')
		if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
		else x.className = x.className.replace(" w3-show", "")
	}
}

/** DropDown class */
if(Konekti.dropdown === undefined) new DropDownPlugIn()

/**
 * Creates a dropdown configuration object
 * @method
 * dropdownConfig
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 * @param content Content
 * @param parent Parent component
 */
Konekti.dropdownConfig = function(id, icon, caption, style, title, content, parent){
	var btn = Konekti.btnConfig(id+'Btn', icon, caption, {"method":"drop", "client":id}, style, title, id)
	var drop = Konekti.divConfig(id+'Drop', '', '', "class='w3-dropdown-content w3-card'", id)
	drop.children = [content]
	return {'plugin':'dropdown', 'id':id, 'children':[btn, drop]}
}

/**
 * Associates/Adds a dropdown
 * @method
 * dropdown
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 * @param content Content
 * @param parent Parent component
 */
Konekti.dropdown = function(id, icon, caption, style, title, content, parent){
	return Konekti.build(Konekti.dropdownConfig(id, icon, caption, style, title, content, parent)) 
}
