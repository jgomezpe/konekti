/** Konekti Plugin for DropDown components */
class DropDown extends Container{
	/**
	 * Creates a dropdown configuration object
	 * @param parent Parent component
	 * @param id Id of the dropdown
	 * @param icon Icon of the dropdown
	 * @param caption Caption of the dropdown
	 * @param content Content
	 * @param config Style of the dropdown
	 */
	 setup(parent, id, icon, caption, content, config={}){
		var btn = {'plugin':'btn', 'setup':[id+'Btn', icon, caption, '', config]}
		var drop = {'plugin':'container', 'setup':['container', id+'Drop', content, '', '', {'tag':'div', "class":'w3-dropdown-content w3-bar-block w3-border'}]}
		config = {'class':' w3-dropdown-hover'}
		return super.setup(parent, 'dropdown', id, [btn,drop], '', '', config)		
	}

	/**
	 * Creates a dropdown configuration object
	 */
	constructor(){ super(...arguments) }    
}

/**
 * Associates/Adds a dropdown
 * @method
 * dropdown
 * @param parent Parent component
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param content List of options to dropdown
 * @param config Style of the dropdown
 */
Konekti.dropdown = function(parent, id, icon, caption, content, config={}){
	return new DropDown(parent, id, icon, caption, content, config)
}