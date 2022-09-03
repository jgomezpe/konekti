uses('btn')

/** Konekti Plugin for DropDown components */
class DropDownPlugIn extends PlugIn{
	/** Creates a Plugin for Dropdown components */
	constructor(){ super('dropdown') }    

	/**
	 * Gets a client for a Dropdown component
	 * @param config Dropdown configuration
	 */  
	client( config ){ 
		var client = new Btn(config)
		client.drop = function(){
			var x = this.vc('Drop')
			if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
			else x.className = x.className.replace(" w3-show", "")	
		} 
		return client 
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
Konekti.dropdownConfig = function(id, icon, caption, style, title, content, parent='KonektiMain'){
	var btn = Konekti.btnConfig(id, icon, caption, {"method":"drop", "client":id}, style, title, parent)
	var drop = Konekti.divConfig(id+'Drop', '', '', "class='w3-dropdown-content w3-bar-block' style='margin-left:-16px;margin-top:6px'", '', id)
	if(Array.isArray(content) ) drop.children = content
	else drop.children = [content]
	btn.children.push(drop)
	btn.plugin = 'dropdown'
	return btn
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
Konekti.dropdown = function(id, icon, caption, style, title, content){
	return Konekti.build(Konekti.dropdownConfig(id, icon, caption, style, title, content)) 
}

/**
 * dropdownList configuration object
 * @method
 * dropdown
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 * @param options List of options
 * @param parent Parent component
 */
 Konekti.dropdownListConfig = function(id, icon, caption, style, title, options, onclick, parent='KonektiMain'){
	for( var i=0; i<options.length; i++ )
		if( typeof options[i] == 'string' ) options[i] = Konekti.btnConfig(options[i], "", options[i], onclick, 'w3-bar-item', options[i])
		else options[i] = Konekti.btnConfig(options[i].id, options[i].icon, options[i].caption, onclick, 'w3-bar-item', options[i].title)
	return Konekti.dropdownConfig(id, icon, caption, style, title, options, parent)
}

/**
 * Associates/Adds a dropdown with an option list
 * @method
 * dropdown
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 * @param options List of options
 * @param parent Parent component
 */
 Konekti.dropdownList = function(id, icon, caption, style, title, options, onclick){
	return Konekti.build(Konekti.dropdownListConfig(id, icon, caption, style, title, options, onclick))
}
